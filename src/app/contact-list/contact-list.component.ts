import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog, MatDialogRef } from '@angular/material';
import { SinchService } from '../sinch.service';
import { CallingService } from '../services/calling.service';
import { HistoryModule, History } from '../database/history/history.module';
import { DialerComponent } from '../dialer/dialer.component';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['../message/message.component.scss','../mainlist/mainlist.component.scss','./contact-list.component.scss']
})
export class ContactListComponent implements OnInit {
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
    this.historyModule.getContacts().subscribe((history) => this.history = history)
    this.callingService.incomingCallEvent().subscribe((call) => {
      if (this.callDialogOpen) {
        this.dialogRef.close(false);
        this.callDialogOpen = false;
      }
      //this.onNewCall(call, null);
    });
  }

}
