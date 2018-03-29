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
      supportActiveConnection: configuration ? configuration.supportActiveConnection : false,
      onLogMessage: function(message) {
        console.log(message);
      },
    });
  }
  
  start(authTicket:any):Promise<any> {
    return this.sinchClient.start(authTicket);
  }

  stop():void {
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
}

export class CallClient {
  constructor(private callClient:any) {

  }
  callPhoneNumber(number:string):Call {
    return new Call(this.callClient.callPhoneNumber(number));
  } 
}

export class Call {
  constructor(private call:any) {
    
  }
  hangup() {
    this.call.hangup();
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
