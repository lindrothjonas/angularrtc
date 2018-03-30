import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Account, AccountType, Configuration } from '../rtc/sinch/configuration'
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AccountService {
  accounts: Map<string, Account>;
  observer: Observable<Account[]>
  subject$: BehaviorSubject<Account[]>
  uuid: string = UUID.UUID();
  constructor(protected localStorage: AsyncLocalStorage) { 
    /*this.observer = new Observable<Account[]>( (observer) => localStorage.getItem("accounts").subscribe( (accounts) => {
      observer.next(Array.from(accounts.values()));
    } ) )*/
    this.subject$ = new BehaviorSubject<Account[]>([])
    this.localStorage.getItem("accounts").subscribe( (accounts) => {
      //this.subject$.next(Array.from(accounts.values()));
    })
  }

  setAccount (account:Account):Observable<any> {
    if (account.id == null) {
      account.id = UUID.UUID();
    }
    if (this.accounts == null) {
      this.accounts = new Map<string, Account>();
    }
    this.accounts.set(account.id, account);
    this.subject$.next(Array.from(this.accounts.values()));
    return this.localStorage.setItem('accounts', this.accounts).pipe(tap( () => {}), catchError((err1, err2) => { console.log(err1);return null}));
  }

  removeAccount (id:string):Observable<any> {
    
    this.accounts.delete(id);
    return this.localStorage.setItem('accounts', this.accounts);
  }

  getAccount(id:string):Observable<Account> {
    return new Observable((observable) => {
      this.getAccounts().subscribe((accounts) => {  
        observable.next(this.accounts.get(id));
        //observable.complete();
      });
    });
  }

  getObservable():BehaviorSubject<Account[]> {
    return this.subject$;
  }

  getAccounts():Observable<Account[]> {
    return new Observable((observable) => {
      if (this.accounts) {
        observable.next(Array.from(this.accounts.values()));
        //observable.complete();
      } else {
        this.localStorage.getItem('accounts').pipe().subscribe((accounts) => 
          { 
            this.accounts = accounts == null ? new Map<string, Account>() : accounts;
            
            observable.next(Array.from(this.accounts.values())) 
            //observable.complete();
          });
      }
    });   
  }
  
}
