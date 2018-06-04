import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from './configuration'
import { Observable ,  Subject } from 'rxjs';
import { Track} from '../../rtc/media/track'
import { Audio } from '../../rtc/media/audio'
import { Stream } from '../../rtc/media/stream'
import { Media } from '../../rtc/media/media'
import { Video } from '../../rtc/media/video'
import { MediaDevices } from '../../rtc/media/mediadevices'

export declare class SinchClient {
  constructor(config:SinchConfiguration)
  config(credentials:Credentials):void
  log(message:any, promise:Promise<any>):void
  terminate():void
  newUser(user:User):Promise<any>
  startActiveConnection():Promise<void>
  //fix parameter types
  start(user:any):Promise<any>
  setUrl(urls:any):void
  signSession(configuration:any):void
  signTicket(configuration:any):void
  signApp(configuration:any):void
  getSession():any
  getCallClient():any

}

export declare class Credentials {
  appKey:string
  sessionId:string
  sessionSecret:string
}

export declare class SinchConfiguration {
  capabilities?:any
  applicationKey:string
  applicationSecret?:string
  onLogMessage?: (message:any) => void 
  onLogMxpMessage?: (message:any) => void
  supportActiveConnection?:boolean 
  expiresIn?:number 
  customStream?:any 
  supportManagedPush?:boolean
  progressTimeout?:number
}

export declare class User {
  email?:string
  username?:string
  number?:string
  password?:string
  pushNotificationDisplayName?:string
}

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})



export class SinchModule {
  private sinchClient: SinchClient;
  constructor() {

  }
  
  init(applicationKey:string, configuration: Configuration) {
    this.sinchClient = new SinchClient({
      applicationKey: applicationKey,
      capabilities: {calling: true, video: true},
      supportActiveConnection: configuration ? configuration.supportActiveConnection : true,
      onLogMessage: (message) =>  console.log(message)
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
    return new Call(this.callClient.callPhoneNumber(number, undefined, stream != null && stream.stream != null ? stream.stream : undefined), stream != null);
  }

  callUser(user:string, headers:any = null, stream:Stream = null):Call {
    return new Call(this.callClient.callUser(user, headers, stream != null && stream.stream != null ? stream.stream : undefined), stream != null);
  }

  incomingCallObserver():Observable<Call> {
    return new Observable<Call>((observer) => {
    this.callClient.addEventListener( { onIncomingCall : (call) => observer.next(new Call(call))});
    })
  }
}

export interface ICallEventListener {
  onCallEstablished(call:Call):void;
}

export class Call {
  private callSubject:Subject<string> = new Subject()
  private localmedia:Media
  private remotemedia:Media
  constructor(private call:any, public externalStream:boolean = false) {
    this.call.addEventListener({ 
      onCallProgressing: (call) => { this.callSubject.next("progressing")},
      onCallEstablished: (call) => { 
        let stream:Stream = this.getRemoteStream();
        stream.stream = this.call.pc.getRemoteStreams()[0]
        this.remotemedia = this.createMedia(stream)
        this.callSubject.next("established")
        if (this.remotemedia) {
          this.callSubject.next("onremotemedia")
        }
        
      },
      onCallEnded: (call) => {
        if (!this.externalStream) {
          this.getLocalStream().stop()
        }
        this.callSubject.next("ended")
      },
      onLocalStream: (call:any, stream:any) => { 
        this.localmedia = this.createMedia(this.getLocalStream())
        if (this.localmedia) {
          this.callSubject.next("onlocalmedia") 
        }
      },
      onRemoteTrack: (call) => {  }
    });
  }
  
  createMedia(stream:Stream):Media {
    if (stream != null) {
      let media:Media = (stream.hasVideo() ? new Video(stream.getStreamUrl()) : new Audio(stream.getStreamUrl())) as Media
      return media
    }
    return null
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
    return Stream.Create(this.call.outgoingStream)
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
      let stream:any = this.call.pc.getRemoteStreams()[0]
      let remoteStream:Stream = Stream.Create(stream)
      return remoteStream
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

