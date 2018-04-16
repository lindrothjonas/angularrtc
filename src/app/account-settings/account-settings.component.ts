import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { Account, Configuration, AccountType } from '../rtc/sinch/configuration';
import { AccountModule } from '../database/account/account.module';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss']
})
export class AccountSettingsComponent implements OnInit {
  nameCtrl = new FormControl();
  descriptionCtrl = new FormControl();
  keyCtrl = new FormControl();
  identityCtrl = new FormControl();
  secretCtrl = new FormControl();
  constructor(@Inject(MAT_DIALOG_DATA) public data: Account, 
              private dialogRef:MatDialogRef<AccountSettingsComponent>,
              private accountModule:AccountModule) { 
    if (this.data) {
      this.nameCtrl.setValue(this.data.name);
      this.descriptionCtrl.setValue(this.data.description);
      this.keyCtrl.setValue(this.data.key);
      this.identityCtrl.setValue(this.data.identity);
      this.secretCtrl.setValue(this.data.secret);
      
    }

  }

  ngOnInit() {
  }

  save() {
    let data:Account = new Account(this.data.type,
      this.keyCtrl.value,
      this.identityCtrl.value,
      this.secretCtrl.value, 
      this.data.configuration,
      this.nameCtrl.value,
      this.descriptionCtrl.value,
      this.data.id);
    data.active = this.data.active;
    this.accountModule.set(data).subscribe(() => this.dialogRef.close(true));
    
  }
}
