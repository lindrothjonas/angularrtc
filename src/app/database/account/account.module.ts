import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/localstorage.service';
import { Account, AccountType, Configuration } from '../../rtc/sinch/configuration'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
@Injectable()
export class AccountModule { 
  private table:string = "accounts"
  constructor(private accountService:LocalStorageService) { 
  }

  public set(account:Account):Observable<any> {
    return this.accountService.set(this.table, account);
  }

  public remove(id:string):Observable<any> {
    return this.accountService.remove(this.table, id);
  }

  public get(id:string):Observable<Account> {
    return this.accountService.get(this.table, id);
  }

  public getAll():Observable<Account[]> {
    return this.accountService.getAll(this.table);
  }

  public getData():Observable<Account[]> {
    return this.accountService.getData(this.table)
  }
  
}
