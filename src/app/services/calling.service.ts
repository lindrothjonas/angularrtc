import { Injectable } from '@angular/core';
import { SinchService } from '../sinch.service';
import { Call, CallClient } from '../rtc/sinch/sinch.module'
import { Observable, Subject } from 'rxjs';
import { Track} from '../rtc/media/track'
import { Audio } from '../rtc/media/audio'
import { Stream } from '../rtc/media/stream'
import { MediaDevices } from '../rtc/media/mediadevices'


@Injectable()
export class CallingService {
  private events:Subject<Call>
  private callClient:CallClient
  private ringtone:string
  private progresstone:string
  private media:MediaDevices
  private stream:Stream
  private audioPlayer:Audio 
  constructor(private sinchService:SinchService) { 
    this.media = MediaDevices.Create()
    this.events = new Subject<Call>()
    this.media.getStream(true, true).subscribe((stream) => {
      this.stream = stream
      this.stream.stop()
      sinchService.getEvents().subscribe((account) => {
        if (account && account.active) {
          this.callClient = sinchService.getCallClient()
          this.callClient.incomingCallObserver().subscribe((call) => {
            this.audioPlayer = new Audio(this.ringtone)
            this.events.next(call)
            this.audioPlayer.play()
            this.handleAudioEvents(call);
          })
        }
      })
    })
  }
  
  init(ringtone:string, progresstone:string):void {
    
    this.ringtone = ringtone
    this.progresstone = progresstone
  }

  incomingCallEvent():Observable<Call> {
    return this.events.asObservable()
  }

  

  handleAudioEvents(call:Call):void {
    call.callEvents().subscribe((state) => { 
      switch (state) {
        case "established":
        if (this.audioPlayer )
          this.audioPlayer.stop()
           
        break;
        case "ended":
          if (this.audioPlayer )
            this.audioPlayer.stop()   
        break;
        case "progressing":
          this.audioPlayer = new Audio(this.progresstone);
          this.audioPlayer.play(true)
        break
        
      }
    })
  }

  callUser(user:string):Observable<Call> {
    return this.call(user)
  }

  callPhoneNumber(number:string):Observable<Call> {
    return this.call(number, true)
  }

  callConference(conferenceRoom:string):Observable<Call> {
    return this.call(conferenceRoom, false, true)
  }

  private call(destination:string, callNumber:boolean = false, callConference:boolean = false):Observable<Call> {
    return new Observable((observer) => {
      if (this.callClient != null) {
          let call:Call = callConference ? this.callClient.callConference(destination) : 
            callNumber ? this.callClient.callPhoneNumber(destination) :
            this.callClient.callUser(destination, null)
          this.handleAudioEvents(call);
          observer.next(call);
         
      } else observer.next(null);
    })
  }
}
