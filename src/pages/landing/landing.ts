import { CurrentListPage } from './../current-list/current-list';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
  }
  openCurrentList(){
    this.navCtrl.push(CurrentListPage);
  }
  openReports(){

  }
}
