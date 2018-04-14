import { Injectable } from '@angular/core';
import { SinchModule, CallClient } from './rtc/sinch/sinch.module'
import { Configuration, Account } from './rtc/sinch/configuration';
import { AccountService } from './services/account.service'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SinchService {
  private sinch: SinchModule
  private events: Subject<Account>
  constructor(private accountService:AccountService) {
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
    this.accountService.getAccount(id).subscribe((account) => { 
      this.activateAccount(account, false).subscribe(() => {
        observable.next();
      });
    })})
  }

  activateAccount(account:Account, activate:boolean):Observable<any> {
    account.active = activate;
    return this.accountService.setAccount(account);
  }

  startActive():Observable<Account> {
    return new Observable((observable) => {
      this.accountService.getAccounts().subscribe((accounts) => {
        accounts.forEach((account) => {
          if (account.active) {
            this.start(account.id).subscribe(() => observable.next(account));
            return;
          }
        })
        observable.next(null);
      })
    })   
  }

  start(accountId:string = null):Observable<Account> {
    this.accountService.getAccount(accountId).subscribe((account) => {
      this.sinch = new SinchModule();
      this.sinch.init(account.key, account.configuration);
      this.sinch.signIn(account.identity, account.secret)
      .then(() => { 
        this.sinch.startActiveConnection().then(() => this.activateAccount(account, true).subscribe(() => {
          this.events.next(account);
        }))
      })
      .catch(() => 
        {
          this.sinch.register(account.identity, account.secret)
                .then(() => { 
                  this.sinch.startActiveConnection()
                          .then(() => this.activateAccount(account, true)
                          .subscribe(() => this.events.next(account))); 
                })
                .catch((err) => this.events.error(err.message)); 
        });
    });
    return this.events.asObservable();
  }
}
