import { Component, OnInit } from '@angular/core';

import { MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { Call } from '../rtc/sinch/sinch.module';
import { DialerComponent } from '../dialer/dialer.component';

import { CallcenterService } from '../services/callcenter.service';

@Component({
  selector: 'app-callcenter',
  templateUrl: './callcenter.component.html',
  styleUrls: ['./callcenter.component.scss']
})
export class CallcenterComponent implements OnInit {
  private callDialogOpen:boolean = false
  private dialogRef:MatDialogRef<DialerComponent>

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public callcenterService:CallcenterService) {}

  ngOnInit() {
  }

  onCall(destination:String):void {
    this.onNewCall(null, destination)
  }

  onNewCall(call:Call, destination:String) {

    if (this.callDialogOpen) {
      this.dialogRef.close(false);
      this.callDialogOpen = false;
      
      return;
    }
    this.dialogRef = this.dialog.open(DialerComponent, {
      width: '390px',
      height: '540px',
      panelClass: 'dialer-dialog',
      hasBackdrop:false,
      data: call != null ? call : destination
    });
    this.callDialogOpen = true;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Account saved!', null, {
          duration: 2000,
          horizontalPosition: "left"
          
        });
        
      }
      this.callDialogOpen = false;
    });
  }
}
