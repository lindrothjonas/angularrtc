import { Component, OnInit, NgZone, Inject, ViewChildren, ViewChild, OnChanges, QueryList } from '@angular/core';
import { FormControl } from '@angular/forms';
import { SinchService } from '../sinch.service';
import { Call } from '../rtc/sinch/sinch.module';
import { MatChipInputEvent, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent, MatDialogRef } from '@angular/material';
import { CallingService } from '../services/calling.service';
import { HistoryModule, History, CallState, SessionType } from '../database/history/history.module';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-dialer',
  templateUrl: './dialer.component.html',
  styleUrls: ['./dialer.component.scss']
})
export class DialerComponent implements OnInit {
  //@ViewChildren('incomingmedia') incomingmedias:QueryList<any> 
  //@ViewChildren('outgoingmedia') outgoingmedias:QueryList<any>
  
  private incomingMedia:any
  private outgoingMedia:any
  numberCtrl = new FormControl();
  public callIcon:string = "call_end";
  public callButtonIcon:string = "call";
  public tooltip:string = "Call";
  public initiating:boolean = false;
  public outgoing:boolean = false;
  public incall:boolean = false;
  public call:Call;
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
    
      if (data != null && data instanceof Call) {
        
        this.callStarted(data, "pstn")
        this.initiating = false
        this.tooltip = "Answer"
        this.handleCallEvent("incoming")
        
      } else {
        if (data) {
          this.numberCtrl.setValue(data)
          this.initiating = true;
        }
      
        this.outgoing = true
        this.tooltip = "Call"
        
      }
      
  }

  @ViewChild('outgoingmedia') set mout(media:any) {
    this.outgoingMedia = media
    this.updateMedia()
  }
  @ViewChild('incomingmedia') set min(media:any) {
    this.incomingMedia = media
    this.updateMedia()
  }
  private incomingSizeSet:boolean = false;
  updateMedia():void {
    if (this.outgoingMedia && this.incomingMedia) {
      if (true) {
        this.outgoingMedia.nativeElement.addEventListener( "loadedmetadata", function (e) {
          if (!this.incomingSizeSet) {
            this.dialogRef.updateSize(540*e.srcElement.videoWidth/e.srcElement.videoHeight + "px", "540px")
          }
        }.bind(this), false );
        this.incomingMedia.nativeElement.addEventListener( "loadedmetadata", function (e) {
          this.incomingSizeSet = true;
          this.dialogRef.updateSize(540*e.srcElement.videoWidth/e.srcElement.videoHeight + "px", "540px")
        }.bind(this), false );
      }
    }
  }
  
  ngOnInit() {
    this.historyModule.getAll().subscribe((history) => {
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
    if (this.outgoing && this.initiating) {
      this.onCall()
    }
  }

  onHangup() {
    if (this.call) {
      this.call.hangup();
    }
  }

  callStarted(call:Call, type:string) {
    this.incall = true
    this.call = call
    if (call == null) {
      this.handleCallEvent("ended")
      return
    }
    if (!this.outgoing) {
      this.numberCtrl.setValue(call.getFromUserId())
    }
    
    this.call.callEvents().subscribe((state) => this.handleCallEvent(state))
    let history:History = { 
                  id:null, 
                  destination:this.numberCtrl.value, 
                  type:type, 
                  timestamp:new Date(), 
                  outgoing:this.outgoing,
                  callState:CallState.Initiating, 
                  sessionType:SessionType.Call
                }
    this.historyModule.set(history).subscribe()
  }
  onCall():void {
    if (this.call) {
      this.call.answer();
    } else {
      this.initiating = true;
      this.outgoing = true;
      this.callButtonIcon = "call_end";
      this.incall = true;
      
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
        this.dialogRef.updateSize("390px", "540px")
        this.call = null;
        setTimeout(() => this.zone.run(() => {if (this.call == null) this.dialogRef.close()}), 3000);
        this.incall = false;
        this.incomingSizeSet = false;
      }
      else if (state == "mediastream") {
        this.call.getLocalMedia().setElement(this.outgoingMedia.nativeElement)
      }
      else if (state == "established") {
        this.call.getRemoteMedia().setElement(this.incomingMedia.nativeElement)
        
      }
      else if (state == "incoming") {
        setTimeout(() => this.zone.run(() => {this.call.answer()}), 1000);
      }
      if (this.icon[state]) {
        this.callIcon = this.icon[state].icon
      }
         
      
    })
  }
  onDestinationSelected(event: MatAutocompleteSelectedEvent) {

  }
}
