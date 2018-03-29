import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AppComponent } from './app.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { MaterialModule } from './material.module';
import { SidenavComponent } from './sidenav/sidenav.component';
import { MainlistComponent} from './mainlist/mainlist.component';
import { MessageComponent} from './message/message.component';
import { TestComponent } from './test/test.component'
import { SinchService } from './sinch.service'
import { AccountService } from './services/account.service'
import { AsyncLocalStorageModule } from 'angular-async-local-storage'
import { AccountSettingsComponent } from './account-settings/account-settings.component';
import { DialerComponent } from './dialer/dialer.component';

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    SidenavComponent,
    MainlistComponent,
    MessageComponent,
    TestComponent,
    AccountSettingsComponent,
    DialerComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MaterialModule,
    AsyncLocalStorageModule
    
  ],
  entryComponents: [
    AccountSettingsComponent,
    DialerComponent
  ],
  providers: [AccountService, SinchService,  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
