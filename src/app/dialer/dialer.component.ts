import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SinchService } from '../sinch.service';
import { Call } from '../rtc/sinch/sinch.module';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss']
})
export class DialerComponent implements OnInit {
  numberCtrl = new FormControl();
  private call:Call;
  private callIcon:string = "call_end";
  private callButtonIcon:string = "call";
  private tooltip:string = "Call";
  private initiating:boolean = false;
  constructor(private sinchService:SinchService, private zone: NgZone, private dialogRef:MatDialogRef<DialerComponent>) { 

  }

  ngOnInit() {
  }
  onCall() {
    if (this.call) {
      this.call.hangup()
      
    } else {
      this.initiating = true;
      this.callButtonIcon = "call_end";
      this.call = this.sinchService.getCallClient().callPhoneNumber(this.numberCtrl.value);
      this.call.callEvents().subscribe((state) => this.setCallIcon(state));
      
    }
    
  }
  
  setCallIcon(state) {
    this.zone.run(() =>{
      this.initiating = false;
      switch (state) {
        case "progressing":
          this.callIcon = "call" 
          this.callButtonIcon = "call_end";
          this.tooltip = "Hangup"
        break;
        case "established":
          this.callIcon = "phone_in_talk";
          this.callButtonIcon = "call_end";
          this.tooltip = "Hangup"
        break;
        case "ended":
          this.callIcon = "call_end"
          this.call = null;
          this.callButtonIcon = "call";
          this.tooltip = "Call"
          setTimeout(() => this.dialogRef.close(), 2000);
        break;
        default:
          
        break;
      }
    });
  }
}
