import { NgModule, Injectable } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/localstorage.service';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: []
})

export class History {
  constructor(
    public id:string,
    public destination:string,
    public type:string,
    public timestamp:Date) {

  }
}

@Injectable()
export class HistoryModule { 
  private table:string = "history"
  private sorted:Subject<History[]> = new Subject()
  private grouped:Subject<Map<String, History[]>> = new Subject()
  constructor(private accountService:LocalStorageService) {
    this.accountService.getData(this.table).subscribe((history) => {
      this.sorted.next(history.sort((a,b) => { return this.compare(a, b, true)}))
      this.grouped.next(this.getGroupedHistory(history))
    })
  }

  private getGroupedHistory(history:History[]):Map<String, History[]> {
    let current = new Date()
    let grouped = new Map<String, History[]>()
    history.sort((a,b) => { return this.compare(a, b, true)}).forEach((item) => {
      let diff = item.timestamp.getDay() - current.getDay();
      if (diff == 0) {
        if (grouped["Today"] == null) {
          grouped["Today"] = new Array<History>()
        }
        grouped["Today"].push(item)
      } else if (diff = -1) {
        if (grouped["Tomorrow"] == null) {
          grouped["Tomorrow"] = new Array<History>()
        }
        grouped["Tomorrow"].push(item)
      }

    })
    return null;
  }

  private compare(a:History, b:History, desc:boolean):number {
    if (a.timestamp > b.timestamp) return desc ? 1 : -1
    else if (a.timestamp < b.timestamp) return desc ? -1 : 1
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

  public getSortedData():Observable<History[]> {
    return this.sorted
  }

  public getGroupededData():Observable<Map<String, History[]>> {
    return this.grouped
  }
}
