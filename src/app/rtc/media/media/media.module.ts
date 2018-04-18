import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})
export class Track {
  public kind:string
  private track:any
  constructor() {
    
  }
  private setTrack(track:any):void {
    this.track = track
    this.kind = track.kind
  }
  public stop():void {
    this.track.stop()
  }
  public static Create(jstrack:any):Track {
    let track:Track = new Track()
    track.setTrack(jstrack)
    return track
  }
}

export class Stream { 
  constructor(public stream:any) {

  }
  stop():void {
    this.getTracks().forEach((track) => {
      track.stop()
    })
  }
  start():void {

  }
  getVideoTracks():Array<Track> {
    let tracks:Array<Track> = new Array<Track>()
    if (this.stream != null) {
      this.stream.getVideoTracks().forEach(track => {
        tracks.push(Track.Create(track))
      })
    }
    return tracks
  }
  getAudioTracks():Array<Track> {
    let tracks:Array<Track> = new Array<Track>()
    if (this.stream != null) {
      this.stream.getAudioTracks().forEach(track => {
        tracks.push(Track.Create(track))
      })
    }
    return tracks
  }
  getTracks():Array<Track> {
    let tracks:Array<Track> = new Array<Track>()
    if (this.stream != null) {
      this.stream.getTracks().forEach(track => {
        tracks.push(Track.Create(track))
      })
    }
    return tracks
  }
  
}

export class MediaModule { 
  private stream:Stream

  getStream(audio:boolean, video:boolean):Observable<Stream> {
    return new Observable( (observer) => {
      this.getUserMedia({video: video , audio: audio}).then((stream) => {
        this.stream = new Stream(stream);
        observer.next(this.stream)
      })   
    })
  }

  getUserMedia(constraints:any):Promise<any> {
    return navigator.mediaDevices.getUserMedia(constraints)
  }
}
