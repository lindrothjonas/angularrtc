import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../services/account.service';
import { Account, AccountType, Configuration } from '../../rtc/sinch/configuration'
import { Observable } from 'rxjs/Observable';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class AccountModule { 
  constructor(private accountService:AccountService) {

  }

  set(account:Account):Observable<any> {
    return this.accountService.setAccount(account);
  }


}
