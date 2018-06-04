//// <reference path="Track.ts" />
import { Track } from "./track";

export class Stream { 
  public stream:any
  public static Create(nativeStream:any = null) {
    let stream = new Stream();
    stream.stream = nativeStream ;
    return stream;
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







