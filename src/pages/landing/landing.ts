import {CurrentListPage} from './../current-list/current-list';
import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';

import {Subscription} from 'rxjs/Subscription';
import {DataProvider} from '../../providers/data/data';
import { QuickSearchPage } from '../quick-search/quick-search';

@Component({selector: 'page-landing', templateUrl: 'landing.html'})
export class LandingPage {

  message : any;
  subscription : Subscription;

  constructor(public navCtrl : NavController, public navParams : NavParams, private _dataService : DataProvider) {

    // subscribe to home component messages
    this.subscription = this
      ._dataService
      .getSubjectObservable()
      .subscribe(message => {        
        console.log(message)
      });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    setTimeout(() => {
      this._dataService.setUser('rajesh');
    },5000)
  }
  openCurrentList() {
    this
      .navCtrl
      .push(CurrentListPage);
  }
  openReports() {}


  gotoQuickSearch(){
    this.navCtrl.push(QuickSearchPage)
  }




}
