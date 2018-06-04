import { Injectable } from '@angular/core';
import { SinchModule, CallClient } from './rtc/sinch/sinch.module'
import { Configuration, Account } from './rtc/sinch/configuration';
import { Observable ,  Subject, BehaviorSubject, observable } from 'rxjs';
import { AccountModule } from './database/account/account.module';
import { observeOn } from 'rxjs/operators';

@Injectable()
export class SinchService {
  private sinch: SinchModule
  private events: BehaviorSubject<Account>
  constructor(private accountModule:AccountModule) {
    
  }

  getCallClient():CallClient {
    return this.sinch.getCallClient();
  }

  getEvents():Observable<Account> {
    if (!this.events)
      this.events = new BehaviorSubject<Account>(null);
    return this.events.asObservable();
  }

  stop(id:string):Observable<any> {
    if (this.sinch != null) {
      this.sinch.terminate();
      delete this.sinch;
    }
    return new Observable((observable) => {
    this.accountModule.get(id).subscribe((account) => { 
      this.activateAccount(account, false).subscribe(() => {
        observable.next();
      });
    })})
  }

  activateAccount(account:Account, activate:boolean):Observable<any> {
    account.active = activate;
    return this.accountModule.set(account);
  }

  startActive():Observable<Account> {
    return new Observable((observable) => {
      this.accountModule.getAll().subscribe((accounts) => {
        accounts.forEach((account) => {
          if (account.active) {
            this.startAccount(account).subscribe(() => observable.next(account));
            return;
          }
        })
        observable.next(null);
      })
    })   
  }

  startAccount(account:Account):Observable<any> {
    this.sinch = new SinchModule();
    this.sinch.init(account.key, account.configuration);
    if (account.platform > 0)
      this.sinch.setUrls(this.accountModule.platforms[account.platform].urls)
      return new Observable<Account>(observable => {
    this.sinch.signIn(account.identity, account.secret)
      .then(() => { 
        this.sinch.startActiveConnection().then(() => this.activateAccount(account, true).subscribe(() => {
          
          if (!this.events) {
            this.events = new BehaviorSubject<Account>(account);
            
          }
          this.events.next(account);        
        }))
      })
      .catch(() =>  {
        this.sinch.register(account.identity, account.secret)
              .then(() => { 
                this.sinch.startActiveConnection()
                        .then(() => this.activateAccount(account, true)
                        .subscribe(() => {
                          if (!this.events) {
                            this.events = new BehaviorSubject<Account>(account); 
                          }
                          this.events.next(account)
                        })); 
              })
              .catch((err) => this.events.error(err.message)); 
      });
    })
    //return this.events.asObservable();
  }

  start(accountId:string = null):Observable<Account> {
    return new Observable<Account>(observable => {
        this.accountModule.get(accountId).subscribe((account) => {
        this.startAccount(account).subscribe((account) => observable.next(account))
      });
    })
    
    //return this.events.asObservable();
  }
}
