import { Media } from '../media/media'
import { Stream } from '../media/stream'
import { Video } from '../media/video'
import { Subject, Observable } from 'rxjs';

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