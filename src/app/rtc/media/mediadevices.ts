import { Observable } from 'rxjs';
import {Stream} from './stream'

export class MediaDevices { 
    private stream:Stream
    public static Create() {
      return new MediaDevices()
    }
    getStream(audio:boolean, video:boolean):Observable<Stream> {
      return new Observable( (observer) => {
        this.getUserMedia({video: video , audio: audio}).then((stream) => {
          this.stream = Stream.Create(stream);
          observer.next(this.stream)
        })   
      })
    }
  
    getUserMedia(constraints:any):Promise<any> {
      return navigator.mediaDevices.getUserMedia(constraints)
    }
  }