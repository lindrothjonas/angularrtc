import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { messages } from './data'
import { FormControl } from '@angular/forms';
import { ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialog, MatSnackBar, MatDialogRef } from '@angular/material';
import { DialerComponent } from '../dialer/dialer.component';


@Component({
  selector: 'app-mainlist',
  templateUrl: './mainlist.component.html',
  styleUrls: ['./mainlist.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MainlistComponent implements OnInit {
  messages = messages;
  private callDialogOpen:boolean = false;
  private dialogRef:MatDialogRef<DialerComponent>;
  private newCallIcon:string = "add";
  constructor(private snackBar: MatSnackBar,
    private dialog: MatDialog) { }

  ngOnInit() {
  }
  onMouseEnter(entered:boolean) {
    this.newCallIcon = entered ? "call" : "add"
  }
  onNewCall(destination, domain) {
    if (this.callDialogOpen) {
      this.dialogRef.close(false);
      return;
    }
    this.dialogRef = this.dialog.open(DialerComponent, {
      width: '350px',
      height: '480px',
      panelClass: 'dialer-dialg',
      hasBackdrop:false,
      data: { destination, domain }
    });
    this.callDialogOpen = true;
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Account saved.', null, {
          duration: 2000
        });
        
      }
      this.callDialogOpen = false;
    });
  }
}
