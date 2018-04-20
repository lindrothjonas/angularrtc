import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { MatGridTileHeaderCssMatStyler } from '@angular/material';
import { element } from 'protractor';

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
  getStreamUrl():string {
    return window.URL.createObjectURL(this.stream);
  }

  hasVideo():boolean {
    return this.getVideoTracks().length > 0
  }

  hasAudio():boolean {
    return this.getVideoTracks().length > 0
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

export class Media  {
  protected element:HTMLMediaElement
  protected externalElement:boolean = false
  private source:string
  private loop:boolean
  private muted:boolean

  public setElement(nativeElement:HTMLMediaElement) {
    this.element = nativeElement
    this.externalElement = true
    if (this.source != null) {
      this.playSource(this.source, this.loop, this.muted)
    }
  }

  public playSource(source:string, loop:boolean, muted:boolean = false) {
    this.source = source
    this.loop = loop
    this.muted = muted
    if (this.getElement() != null) {
      this.element.src = source
      this.element.currentTime = 0
      this.element.loop = loop
      this.element.muted = muted
      this.element.play()    
    }
  }
  
  public getElement():HTMLMediaElement {
    return this.element
  }

  public stop():void {
    if (this.getElement() != null) {
      this.element.pause()
      //this.element.src = ""
      this.element.currentTime = 0 
      if (!this.externalElement) {
        document.body.removeChild(this.element)
        this.element = null
      }   
    }
  }
  public createElement(type:string):void {
    if (this.element == null && !this.externalElement) {
      this.externalElement = false
      this.element = document.createElement(type == "audio" ? "audio" : "video");
      document.body.appendChild(this.element)

    }
  }
}

export class Audio extends Media {
  constructor(externalElement:boolean = false) {
    super()
    this.externalElement = externalElement
  }
  public getElement():HTMLMediaElement {
    this.createElement("audio")
    return this.element
  }
  public getAudioElement():HTMLAudioElement {
    return this.element as HTMLAudioElement
  }
}

export class Video extends Media {
  constructor(externalElement:boolean = true) {
    super()
    this.externalElement = externalElement
    
  }
  public getElement():HTMLMediaElement {
    this.createElement("video")
    return this.element
  }
  public getVideoElement():HTMLVideoElement {
    return this.element as HTMLVideoElement
  }
}
