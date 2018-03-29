import { Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { SinchService } from './sinch.service'
import { AccountService } from './services/account.service'
import { AsyncLocalStorage } from 'angular-async-local-storage'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AsyncLocalStorage]
})
export class AppComponent {
  @ViewChild('sidenav') sidenav; 
  title = 'app';
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, sinchService: SinchService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.sidenav.opened = true;   
  }

  toolbarEvent(event: any) {
    this.sidenav.toggle();
  }
}
