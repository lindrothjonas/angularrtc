import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { messages } from './data'
import { FormControl } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { DialerComponent } from '../dialer/dialer.component';
import { SinchService } from '../sinch.service';
import { CallingService } from '../services/calling.service';
import { Call } from '../rtc/sinch/sinch.module';
import { Observable } from 'rxjs';
import { HistoryModule, History } from '../database/history/history.module';
import { Audio } from '../rtc/media/audio';


@Component({
  selector: 'app-mainlist',
  templateUrl: './mainlist.component.html',
  styleUrls: ['./mainlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainlistComponent implements OnInit {
  private callDialogOpen:boolean = false
  private dialogRef:MatDialogRef<DialerComponent>
  public newCallIcon:string = "add"
  public history:History[]
  
  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog, 
    private sinchService:SinchService, 
    private callingService:CallingService,
    private historyModule:HistoryModule) { }

  ngOnInit() {
    this.historyModule.getSortedData().subscribe((history) => this.history = history)
    this.callingService.incomingCallEvent().subscribe((call) => {
      if (this.callDialogOpen) {
        this.dialogRef.close(false);
        this.callDialogOpen = false;
      }
      this.onNewCall(call, null);
    });
  }
  onRemoved(id:string):void {
    this.historyModule.remove(id).subscribe();
  }
  onCall(destination:String):void {
    this.onNewCall(null, destination);
  }
  onMouseEnter(entered:boolean) {
    this.newCallIcon = entered ? "call" : "add"
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
