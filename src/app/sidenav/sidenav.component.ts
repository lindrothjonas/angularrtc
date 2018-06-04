import { Component, OnInit, AfterViewChecked } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, ViewChild} from '@angular/core';
import { Account, AccountType, IAccountUpdated } from '../rtc/sinch/configuration'
import { startWith, tap, delay } from 'rxjs/operators';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog, MatSnackBar } from '@angular/material';
import { AccountSettingsComponent } from '../account-settings/account-settings.component'
import { SinchService } from '../sinch.service';
import { AccountModule } from '../database/account/account.module';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  @ViewChild('sidenav') sidenav; 
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  public accounts$:Observable<Account[]>;
  private account:Account;
  
  constructor(private snackBar: MatSnackBar,
    private accountModule:AccountModule,
    private dialog: MatDialog,
    private changeDetectorRef: ChangeDetectorRef, 
    media: MediaMatcher, 
    private sinchService:SinchService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.accounts$ = this.accountModule.getData()
    this.sinchService.startActive().subscribe((account) => {
      this.account = account;
      
    })
  }

  removeAccount(id:string) {
    this.accountModule.remove(id).subscribe(result => {
      if (result) {
        this.snackBar.open('Account deleted.', null, {
          duration: 2000
        });
        
      }
    });
  }
  toggle() {
    this.sidenav.toggle();
  }
  activateAccount(account:Account) {
    if (account.active) {
      this.sinchService.stop(account.id).subscribe(() => {
        this.account = null
        
      });
    } else {
      if (this.account == null) {
        this.sinchService.start(account.id).subscribe(() => {
          this.account = account
          
        }, (error) => {
          this.snackBar.open(error, null, {
            duration: 10000,
            horizontalPosition: "left"
          });
        });
      }
    }
  }

  editAccount(data:Account) {
    const dialogRef = this.dialog.open(AccountSettingsComponent, {
      width: '600px',
      panelClass: 'app-account-settings',
      data: data || {} 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Account saved', null, {
          duration: 2000,
          horizontalPosition: "left"
        });
        
      }
    });
  }
}
