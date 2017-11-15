
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { LoginPage } from './../pages/login/login';
import { LandingPage } from './../pages/landing/landing';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { OutletInfoPage } from './../pages/outlet-info/outlet-info';
import { ContactInfoPage } from './../pages/contact-info/contact-info';
import { ContactListPage } from './../pages/contact-list/contact-list';
import { CurrentListPage } from './../pages/current-list/current-list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { DataProvider } from '../providers/data/data';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';

import { MomentModule } from 'angular2-moment';

import { IonicStorageModule } from '@ionic/storage';
import { QuickSearchPage } from '../pages/quick-search/quick-search';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    LandingPage,
    CurrentListPage,
    ContactListPage,
    ContactInfoPage,
    OutletInfoPage,
    HomePage,
    ListPage,
    QuickSearchPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    FormsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    LandingPage,
    CurrentListPage,
    ContactListPage,
    ContactInfoPage,
    OutletInfoPage,
    HomePage,
    ListPage,
    QuickSearchPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider
  ]
})
export class AppModule {}
