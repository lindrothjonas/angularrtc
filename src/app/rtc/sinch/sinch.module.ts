import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from './configuration'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { MediaModule, Stream, Media, Video } from '../media/media/media.module';
declare var SinchClient: any;

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})



export class SinchModule {
  private sinchClient: any;
  
  constructor() {

  }
  
  init(applicationKey:string, configuration: Configuration) {
    this.sinchClient = new SinchClient({
      applicationKey: applicationKey,
      capabilities: {calling: true, video: true},
      supportActiveConnection: configuration ? configuration.supportActiveConnection : true,
      onLogMessage: function(message) {
        console.log(message);
      },
    });
  }
  
  setUrls(urls:any) {
    this.sinchClient.setUrl(urls);
  }

  getSession():Session {
    return this.sinchClient.getSession();
  }

  start(authTicket:any):Promise<any> {
    return this.sinchClient.start(authTicket);
  }

  terminate():void {
    this.sinchClient.terminate();
  }

  signIn(user:string, password:string):Promise<any> {
    return this.start({ username: user, password:password});
  }
  register(user:string, password:string):Promise<any> {
    return this.sinchClient.newUser({ username: user, password:password});
  }

  getCallClient():CallClient {
    return new CallClient(this.sinchClient.getCallClient());
  }
  startActiveConnection():Promise<void> {
    return this.sinchClient.startActiveConnection();
  }
}

export class CallClient {
  
  constructor(private callClient:any) {
    
  }
  callPhoneNumber(number:string, stream:Stream = null):Call {
    return new Call(this.callClient.callPhoneNumber(number, undefined, stream.stream || undefined), stream);
  }

  callUser(user:string, headers:any = null, stream:Stream = null):Call {
    return new Call(this.callClient.callUser(user, undefined, stream.stream || undefined), stream);
  }

  incomingCallObserver():Observable<Call> {
    return new Observable<Call>((observer) => {
    this.callClient.addEventListener( { onIncomingCall : function(call) {
                                        observer.next(new Call(call))
                                      }});
    })
  }
}

export class Call {
  private callSubject:Subject<string> = new Subject()
  private callEventObservable:Observable<string>
  private localmedia:Media
  private remotemedia:Media
  constructor(private call:any, public stream:Stream = null) {
    this.callEventObservable = new Observable<string>((observer) => {
      this.call.addEventListener({ 
        onCallProgressing: function(call) { observer.next("progressing");},
        onCallEstablished: function(call) {observer.next("established");},
        onCallEnded: function(call) { observer.next("ended");},
        onLocalStream: function(call, stream) { observer.next("mediastream"); },
        onRemoteTrack: function(call, stream) { observer.next("onremotetrack"); }
      });
    })
    this.callEventObservable.subscribe((state) => {
      switch (state) {
        case "mediastream":
          let stream:Stream = this.getLocalStream()
          this.localmedia = (stream.hasVideo() ? new Video() : new Audio()) as Media
          this.localmedia.playSource(stream.getStreamUrl(), false, true)
        break
        case "established":
          let remotestream:Stream = this.getRemoteStream()
          if (remotestream) {
            this.remotemedia = (remotestream.hasVideo() ? new Video() : new Audio()) as Media
            this.remotemedia.playSource(remotestream.getStreamUrl(), false, true)
          }
        break
        case "onremotetrack":
          
          
        break
      }
       this.callSubject.next(state)
    });
  }
  
  hangup() {
    this.call.hangup()
  }
  answer():void {
    this.call.answer()
  }

  incomingStreamUrl():string {
    return this.call.incomingStreamURL
  }

  outgoingStreamUrl():string {
    return this.call.outgoingStreamURL
  }

  getState():string {
    return this.call.getState();
    
  }
  
  callEvents():Observable<string> {
    return this.callSubject.asObservable()
  }
  public getLocalStream():Stream {
    return new Stream(this.call.outgoingStream)
  }
  getRemoteUserId():string {
    return this.call.getRemoteUserId()
  }

  getToUserId():string {
    return this.call.toId
  }
  getFromUserId():string {
    return this.call.fromId
  }

  getRemoteStream():Stream {
    if (this.call.pc) {
      return new Stream(this.call.pc.getRemoteStreams()[0])
    }
    return null
  }

  public getLocalMedia():Media {
    return this.localmedia
  }
  public getRemoteMedia():Media {
    return this.remotemedia
  }
}

export enum CallEvent {
  Progressing,
  Established,
  Ended
}

export class Urls {
  public user:string
	public base:string
	public portal:string
	public reporting:string
	public reporting_v2:string
	public calling:string
	public messaging:string
	public verification:string
}

export class Session {
  public userId:string
  public sessionId:string
  public sessionSecret:string
  public pushNotificationDisplayName:string
  
}

