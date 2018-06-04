import { Stream } from './stream'
import { Media } from './media'

export class Audio extends Media {
    constructor(source:string = null, stream:Stream = null, externalElement:boolean = false) {
      super(source, stream)
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