import { Injectable } from '@angular/core';
import { SinchModule, CallClient } from './rtc/sinch/sinch.module'
import { Configuration, Account } from './rtc/sinch/configuration';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { AccountModule } from './database/account/account.module';

@Injectable()
export class SinchService {
  private sinch: SinchModule
  private events: Subject<Account>
  constructor(private accountModule:AccountModule) {
    this.events = new Subject<Account>();
  }

  getCallClient():CallClient {
    return this.sinch.getCallClient();
  }

  getEvents():Observable<Account> {
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
    this.sinch.signIn(account.identity, account.secret)
    .then(() => { 
      this.sinch.startActiveConnection().then(() => this.activateAccount(account, true).subscribe(() => {
        this.events.next(account);
      }))
    })
    .catch(() =>  {
      this.sinch.register(account.identity, account.secret)
            .then(() => { 
              this.sinch.startActiveConnection()
                      .then(() => this.activateAccount(account, true)
                      .subscribe(() => this.events.next(account))); 
            })
            .catch((err) => this.events.error(err.message)); 
    });
    return this.events.asObservable();
  }

  start(accountId:string = null):Observable<Account> {
    this.accountModule.get(accountId).subscribe((account) => {
      this.startAccount(account)
    });
    return this.events.asObservable();
  }
}
