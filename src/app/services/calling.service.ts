import { Injectable } from '@angular/core';
import { SinchService } from '../sinch.service';
import { Call, CallClient } from '../rtc/sinch/sinch.module'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';


@Injectable()
export class CallingService {
  private events:Subject<Call>
  private callClient:CallClient
  private audio:HTMLAudioElement
  private ringtone:string
  private progresstone:string
  constructor(private sinchService:SinchService) { 
    this.events = new Subject<Call>()
    sinchService.getEvents().subscribe((account) => {
      if (account && account.active) {
        this.callClient = sinchService.getCallClient()
        this.callClient.incomingCallObserver().subscribe((call) => {
          this.events.next(call)
          this.playAudio(this.ringtone)
          this.handleAudioEvents(call);
        })
      }
    })

  }
  init(toneplayer:HTMLAudioElement, ringtone:string, progresstone:string):void {
    this.audio = toneplayer
    this.ringtone = ringtone
    this.progresstone = progresstone
  }

  incomingCallEvent():Observable<Call> {
    return this.events.asObservable()
  }

  playAudio(src:string) {
    if (this.audio && this.audio.paused) {   
      console.log("play: " + src)       
      this.audio.src = src
      this.audio.currentTime = 0
      this.audio.play();
    }
  }

  pauseAudio() {
    if (this.audio && !this.audio.paused) {
      this.audio.pause()
      
    }
  }

  handleAudioEvents(call:Call):void {
    call.callEvents().subscribe((state) => { 
      switch (state) {
        case "established":
          this.pauseAudio();
          this.playAudio(call.streamUrl());
        break;
        case "ended":
          this.pauseAudio();
        break;
        case "progressing":
          this.playAudio(this.progresstone);
        break
      }
    })
  }

  callUser(user:string):Call {
    if (this.callClient != null) {
      let call:Call = this.callClient.callUser(user)
      this.handleAudioEvents(call);
      return call;
    } else return null;
  }

  callPhoneNumber(number:string):Call {
    if (this.callClient != null) {
      let call:Call = this.callClient.callPhoneNumber(number)
      this.handleAudioEvents(call);
      return call;
    } else return null;
  }
}
