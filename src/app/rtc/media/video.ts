import { Observable } from 'rxjs';
import { Stream } from './stream'
import { Media } from './media'

export class Video extends Media {
    constructor(source:string = null, stream:Stream = null, externalElement:boolean = true) {
      super(source, stream)
      this.externalElement = externalElement
      
    }
    public getElement():HTMLMediaElement {
      this.createElement("video")
      return this.element
    }
    public getVideoElement():HTMLVideoElement {
      return this.element as HTMLVideoElement
    }
    public setElement(nativeElement:HTMLMediaElement):Observable<{width:number, height:number}> {
      (nativeElement as any).addEventListener( "loadedmetadata", (event) => {
        this.mediaChanged.next({width:event.srcElement.videoWidth, height:event.srcElement.videoHeight})
        
      })
      return super.setElement(nativeElement)
    }
  }