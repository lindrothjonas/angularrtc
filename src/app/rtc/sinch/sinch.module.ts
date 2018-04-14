import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Configuration } from './configuration'
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
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
  
  setUrls(urls:Urls) {
    this.sinchClient.setUrls(urls);
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
  callPhoneNumber(number:string):Call {
    return new Call(this.callClient.callPhoneNumber(number));
  }

  callUser(user:string, headers:any = null, customStream:any = null):Call {
    return new Call(this.callClient.callUser(user, headers));
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
  constructor(private call:any) {
    
  }
  hangup() {
    this.call.hangup()
  }
  answer():void {
    this.call.answer()
  }
  streamUrl():string {
    return this.call.incomingStreamURL
  }

  getState():string {
    return this.call.getState();
    
  }
  callEvents():Observable<string> {
    return new Observable<string>((observer) => {
      this.call.addEventListener( { 
        onCallProgressing: function(call) {
          observer.next("progressing");
        },
        onCallEstablished: function(call) {observer.next("established");},
        onCallEnded: function(call) {observer.next("ended");}
      });
    });
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

