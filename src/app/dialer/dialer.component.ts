import { Component, OnInit, NgZone, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SinchService } from '../sinch.service';
import { Call } from '../rtc/sinch/sinch.module';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { CallingService } from '../services/calling.service';
import { HistoryModule, History } from '../database/history/history.module';
import { Observable } from 'rxjs/Observable';

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
  public outgoing:boolean = false;
  public call:Call;
  //public history$:Observable<History[]>
  //public history:Map<String, History[]> = new Map<String, History[]>()
  public history:History[] = new Array<History>()
  
  public destinations:Array<String> = new Array<String>()
  private icon: { [id: string]: {icon:string}} = {
    "progressing": {icon:"call"},
    "established": {icon:"phone_in_talk"},
    "initiating":{icon:"call_end"},
    "ended":{icon:"call_end"},
    "incoming":{icon:"call_end"}
 };
  

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private sinchService:SinchService, 
    private zone: NgZone, 
    private dialogRef:MatDialogRef<DialerComponent>, 
    private callingService:CallingService,
    private historyModule:HistoryModule) {
      
    
    
    //this.history$ = this.historyModule.getData()
    if (data != null && data instanceof Call) {
      this.call = data;
      this.initiating = false
      this.tooltip = "Answer"
      this.handleCallEvent("incoming")
      this.call.callEvents().subscribe((state) => this.handleCallEvent(state));
      
    } else {
      
      this.numberCtrl.setValue(data)
      this.outgoing = true;
      this.tooltip = "Call"
    }
      
  }

  ngOnInit() {
    this.historyModule.getAll().subscribe((history) => {
      //this.history = history
      let last:String = null
      history.sort((a,b) => {
        if (a.destination > b.destination) return 1
        else if (a.destination < b.destination) return -1
        else return 0
      }).some(((item, index, _arr) => { 
        if (item.destination != last) {
          this.history.push(item)
          last = item.destination
        }
          
        
        return index > 4
      })
    )})
  }

  onHangup() {
    if (this.call) {
      this.call.hangup();
    }
  }

  callStarted(call:Call, type:string) {
    this.call = call
    this.call.callEvents().subscribe((state) => this.handleCallEvent(state))
    let history:History = { id:null, destination:this.numberCtrl.value, type:type, timestamp:new Date()}
    this.historyModule.set(history).subscribe()
  }
  onCall():void {
    if (this.call) {
      this.call.answer();
    } else {
      this.initiating = true;
      this.outgoing = true;
      this.callButtonIcon = "call_end";
      
      if (this.numberCtrl.value.substring(0, 1) == "+") {
        this.callingService.callPhoneNumber(this.numberCtrl.value).subscribe((call) => this.callStarted(call, "pstn"))
      } else {
        this.callingService.callUser(this.numberCtrl.value).subscribe((call) => this.callStarted(call, "user"))
      }
    }
  }
  
  handleCallEvent(state:string):void{
    this.zone.run(() => {
      this.initiating = false;
      if (state == "ended") {
        this.call = null;
        setTimeout(() => this.zone.run(() => {if (this.call == null) this.dialogRef.close()}), 3000);
      }
      this.callIcon = this.icon[state].icon 
    })
  }
  onDestinationSelected(event: MatAutocompleteSelectedEvent) {

  }
}
