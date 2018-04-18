import { Component, OnInit, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatChipInputEvent, MatSelect, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { Account, Configuration, AccountType,Platform } from '../rtc/sinch/configuration';
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
  platform:number = 0
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: Account, 
              private dialogRef:MatDialogRef<AccountSettingsComponent>,
              public accountModule:AccountModule) { 
    if (this.data) {
      this.nameCtrl.setValue(this.data.name);
      this.descriptionCtrl.setValue(this.data.description);
      this.keyCtrl.setValue(this.data.key);
      this.identityCtrl.setValue(this.data.identity);
      this.secretCtrl.setValue(this.data.secret);
      this.platform = this.data.platform == null ? 0 : this.data.platform
    } else {
    
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
      this.data.id, 
      this.platform);
    data.active = this.data.active;
    this.accountModule.set(data).subscribe(() => this.dialogRef.close(true));
    
  }
}
