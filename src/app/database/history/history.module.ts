import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/localstorage.service';
import { Observable ,  Subject } from 'rxjs';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})

export class History {
  public id:string
  public destination:string
  public sessionType:SessionType = SessionType.Call
  public type:string
  public timestamp:Date
  public outgoing:boolean
  public callState:CallState
}

@Injectable()
export class HistoryModule { 
  private table:string = "history"
  private sorted:Subject<History[]> = new Subject()
  //private grouped:Subject<Map<String, History[]>> = new Subject()

  constructor(private accountService:LocalStorageService) {
    this.accountService.getData(this.table).subscribe((history) => {
      this.sorted.next(history.sort((a,b) => { return this.compare(a, b, true)}))
    })
  }

  private compare(a:History, b:History, desc:boolean):number {
    if (a.timestamp > b.timestamp) return desc ? -1 : 1
    else if (a.timestamp < b.timestamp) return desc ? 1 : -1
    else return 0
  }

  private compareContacts(a:History, b:History, desc:boolean):number {
    if (a.timestamp > b.timestamp) return desc ? -1 : 1
    else if (a.timestamp < b.timestamp) return desc ? 1 : -1
    else return 0
  }

  public set(account:History):Observable<any> {
    return this.accountService.set(this.table, account);
  }

  public remove(id:string):Observable<any> {
    return this.accountService.remove(this.table, id);
  }

  public get(id:string):Observable<History> {
    return this.accountService.get(this.table, id);
  }

  public getAll():Observable<History[]> {
    return this.accountService.getAll(this.table);
  }

  public getData():Observable<History[]> {
    return this.accountService.getData(this.table)
  }

  

  public getContacts():Observable<History[]> { 
    return new Observable((observer) => {
      
      this.getData().subscribe((history) => {
        let last:String = null
        let contacts:Array<History> = new Array<History>()
        history.sort((a,b) => {
          if (a.destination > b.destination) return -1
          else if (a.destination < b.destination) return 1
          else return a.timestamp > b.timestamp ? -1 : 1
        }).some(((item, index, _arr) => { 
            if (item.destination != last) {
              contacts.push(item)
              last = item.destination
            }
            return false
          })
        )
        observer.next(contacts.sort((a,b) => { return this.compare(a, b, true)}))
      })
    })
  }

  public getSortedData():Observable<History[]> {
    return new Observable((observer) => {
        this.getData().subscribe((history) => {
        observer.next(history.sort((a,b) => { return this.compare(a, b, true)}))
      })
    })
    
  }

  /*public getGroupededData():Observable<Map<String, History[]>> {
    return this.grouped
  }*/
}


export enum CallState {
  Progressing = 0,
  Initiating = 1,
  Established = 2,
  Ended = 3,
  Ringing = 4,
}

export enum SessionType {
  Uknown = 0,
  Call = 1,
  Messaing = 2
}

