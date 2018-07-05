import { Injectable, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax'; 
import polling from 'rx-polling';

@Injectable({
  providedIn: 'root'
})

export class CallcenterService {

  public test = 'test'
  public availableCalls = []

  constructor() {
    // Request for available calls
    const request$ = ajax({
      url: 'http://localhost:8080/availableCalls',
      crossDomain: true
    }).pipe(
      map(response => response.response || [])
    );
    
    // Repeat polling every second with rx-polling magic to handle inactive tabs and such
    polling(request$, { interval: 1000 })
      .subscribe((availableCalls) => {
        this.availableCalls = availableCalls
        this.availableCalls.forEach(e => {e.timestamp = new Date(e.timestamp || 0)})
      }, (error) => {
        // The Observable will throw if it's not able to recover after 9 attempts
        console.error(error);
      });
   }
}
