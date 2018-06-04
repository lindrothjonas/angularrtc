import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/localstorage.service';
import { Account, AccountType, Configuration, Platform } from '../../rtc/sinch/configuration'
import { Observable ,  Subject } from 'rxjs';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
@Injectable()
export class AccountModule { 
  public platforms = new Array<Platform>(
    new Platform(null, 0, "Live", "Live"), 
    new Platform("01", 1, "Ftest-01", "Ftest-01"),
    new Platform("02", 2, "Ftest-02", "Ftest-02"))
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
