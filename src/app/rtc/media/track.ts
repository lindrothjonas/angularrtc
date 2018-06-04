  
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
  
  

