import { Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { SinchService } from './sinch.service'
import { AsyncLocalStorage } from 'angular-async-local-storage'
import { CallingService } from './services/calling.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [AsyncLocalStorage]
})
export class AppComponent {
  @ViewChild('sidenav') sidenav; 
  @ViewChild('toneplayer') toneplayer;
  title = 'app';
  mobileQuery: MediaQueryList;
  audio:HTMLAudioElement;
  private _mobileQueryListener: () => void;
  constructor(changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher, 
              private sinchService: SinchService, 
              private callingService: CallingService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.sidenav.opened = true;
    this.callingService.init(this.toneplayer.nativeElement, "ringtone.wav","progresstone.wav");
  }

  toolbarEvent(event: any) {
    this.sidenav.toggle();
  }
}
