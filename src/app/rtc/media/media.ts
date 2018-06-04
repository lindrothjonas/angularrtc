import { BehaviorSubject, Subject, Observable } from 'rxjs';
import { Stream } from './stream'
export class Media  {
    protected element:HTMLMediaElement
    protected externalElement:boolean = false
    private loop:boolean
    private muted:boolean
    public mediaChanged:BehaviorSubject<{width:number, height:number}> = new BehaviorSubject(null)
    constructor(private source:string = null, private stream:Stream = null) {
      
    }
    public setElement(nativeElement:HTMLMediaElement):Observable<{width:number, height:number}> {
      this.element = nativeElement
      this.externalElement = true
      this.play()
      return this.mediaChanged
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
  
    public playStream(stream:Stream, loop:boolean, muted:boolean = false) {
      this.stream = stream
      this.loop = loop
      this.muted = muted
      if (this.getElement() != null) {
        this.element.srcObject = stream.stream
        this.element.currentTime = 0
        this.element.loop = loop
        this.element.muted = muted
        this.element.play()    
      }
    }
  
    public play(loop:boolean = false, muted:boolean = true):void {
      if (this.stream != null) {
        this.playStream(this.stream, loop, muted)
      }
      if (this.source != null) {
        this.playSource(this.source, this.loop, this.muted)
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
