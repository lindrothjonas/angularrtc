import { Injectable } from '@angular/core';
import { SinchService } from '../sinch.service';
import { Call, CallClient } from '../rtc/sinch/sinch.module'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MediaModule, Stream } from '../rtc/media/media/media.module';


@Injectable()
export class CallingService {
  private events:Subject<Call>
  private callClient:CallClient
  private audio:HTMLAudioElement
  private ringtone:string
  private progresstone:string
  private media:MediaModule
  private stream:Stream
  constructor(private sinchService:SinchService) { 
    this.media = new MediaModule()
    this.events = new Subject<Call>()
    this.media.getStream(true, true).subscribe((stream) => {
      this.stream = stream
      stream.stop()
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
      this.audio.src = src
      this.audio.currentTime = 0
      this.audio.play()
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

  callUser(user:string):Observable<Call> {
    return this.call(user)
  }

  callPhoneNumber(number:string):Observable<Call> {
    return this.call(number, true)
  }
  private call(destination:string, callNumber:boolean = false):Observable<Call> {
    return new Observable((observer) => {
      if (this.callClient != null) {
        this.stream.start()
        this.media.getStream(true, true).subscribe((stream) => {
          let call:Call = callNumber ? this.callClient.callPhoneNumber(destination, stream.stream) :
                                        this.callClient.callUser(destination, stream.stream)
          this.handleAudioEvents(call);
          observer.next(call);
        })  
      } else observer.next(null);
    })
  }
}
