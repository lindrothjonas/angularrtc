import { Component } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, ViewChild, OnInit } from '@angular/core';
import { SinchService } from './sinch.service'
import { AsyncLocalStorage } from 'angular-async-local-storage'
import { CallingService } from './services/calling.service';
import { ActivatedRoute, Params } from '@angular/router';
import { AccountModule } from './database/account/account.module';

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
  constructor(changeDetectorRef: ChangeDetectorRef, 
              media: MediaMatcher, 
              private sinchService: SinchService, 
              private callingService: CallingService,
              private activatedRoute: ActivatedRoute,
              private accountModule:AccountModule) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params["account"]) {
        console.log(atob(params["account"]));
      }    
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  ngOnInit(): void {
    this.sidenav.opened = true;
    this.callingService.init("ringtone.wav","progresstone.wav");
      
  }

  toolbarEvent(event: any) {
    this.sidenav.toggle();
  }
}
