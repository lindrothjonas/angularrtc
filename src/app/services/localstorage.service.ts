import { Injectable } from '@angular/core';
import { AsyncLocalStorage } from 'angular-async-local-storage';
import { Account, AccountType, Configuration } from '../rtc/sinch/configuration'
import { Observable } from 'rxjs/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class LocalStorageService {
  private tables: Map<String, Map<String, any>>
  public data:Map<string, Subject<any[]>>
  constructor(protected localStorage: AsyncLocalStorage) { 
    this.tables = new Map<String, Map<String, any>>()
    this.data = new Map<string, Subject<any[]>>()
  }

  getData(table:string):Observable<any[]> {
    if (this.data[table] == null) {
      this.data[table] = new Subject()
      this.getAll(table).subscribe((accounts) => {
        this.data[table].next(accounts)
      })
    }

    return this.data[table].asObservable();
  }
  tableUpdated(table:string):void {
    if (this.data[table]) {
      this.data[table].next(Array.from(this.tables[table].values()));
    } 
  }
  set(table:string ,data:any):Observable<any> {
    if (data.id == null) {
      data.id = UUID.UUID()
    }
    if (this.tables[table] == null) {
      this.tables[table] = new Map<string, any>()    
    }
    this.tables[table].set(data.id, data)
    this.tableUpdated(table)
    return this.localStorage.setItem(table, this.tables[table]).pipe(tap( () => {}), catchError((err1, err2) => { console.log(err1);return null}))
  }

  remove (table:string, id:string):Observable<any> {
    
    this.tables[table].delete(id)
    this.tableUpdated(table)
    return this.localStorage.setItem(table, this.tables[table])
  }

  get(table:string, id:string):Observable<any> {
    return new Observable((observable) => {
      this.getAll(table).subscribe((accounts) => {  
        observable.next(this.tables[table].get(id))
        
      });
    });
  }


  getAll(table:string):Observable<any[]> {
    return new Observable((observable) => {
      if (this.tables[table]) {
        observable.next(Array.from(this.tables[table].values()))
        
      } else {
        this.localStorage.getItem(table).pipe().subscribe((accounts) => 
          { 
            this.tables[table] = accounts == null ? new Map<string, any>() : accounts
            observable.next(Array.from(this.tables[table].values()))           
          });
      }
    });   
  }
  
}
