import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SinchService } from '../sinch.service';
import { Call } from '../rtc/sinch/sinch.module';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { CallingService } from '../services/calling.service';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss']
})
export class DialerComponent implements OnInit {
  numberCtrl = new FormControl();
  public callIcon:string = "call_end";
  public callButtonIcon:string = "call";
  public tooltip:string = "Call";
  public initiating:boolean = false;
  private outgoing:boolean = false;
  private icon: { [id: string]: {icon:string}} = {
    "progressing": {icon:"call"},
    "established": {icon:"phone_in_talk"},
    "initiating":{icon:"call_end"},
    "ended":{icon:"call_end"},
    "incoming":{icon:"call_end"}
 };
  

  constructor(@Inject(MAT_DIALOG_DATA) public call: Call,
    private sinchService:SinchService, 
    private zone: NgZone, 
    private dialogRef:MatDialogRef<DialerComponent>, 
    private callingService:CallingService) { 
    if (call != null) {
      this.initiating = false
      this.tooltip = "Answer"
      this.handleCallEvent("incoming")
      this.call.callEvents().subscribe((state) => this.handleCallEvent(state));
    } else {
      this.outgoing = true;
      this.tooltip = "Call"
    }
      
  }

  ngOnInit() {

  }

  onHangup() {
    if (this.call) {
      this.call.hangup();
    }
  }

  onCall() {
    if (this.call) {
      this.call.answer();
    } else {
      this.initiating = true;
      this.outgoing = true;
      this.callButtonIcon = "call_end";
      if (this.numberCtrl.value.substring(0, 1) == "+") {
        this.call = this.callingService.callPhoneNumber(this.numberCtrl.value);
      } else {
        this.call = this.callingService.callUser(this.numberCtrl.value);
      }
      
      this.call.callEvents().subscribe((state) => this.handleCallEvent(state));
    }
  }
  
  handleCallEvent(state:string):void{
    this.zone.run(() => {
      this.initiating = false;
      if (state == "ended") {
        this.call = null;
        setTimeout(() => this.zone.run(() => {if (this.call == null) this.dialogRef.close()}), 10000);
      }
      this.callIcon = this.icon[state].icon 
    })
  }
}
