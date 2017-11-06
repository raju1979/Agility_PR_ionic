import { ContactListPage } from './../contact-list/contact-list';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-current-list',
  templateUrl: 'current-list.html',
})
export class CurrentListPage {
  currentList: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.currentList = [
      {
        name: 'Agile Miser Comms List',
        createdOn: 'Jan 17, 2017',
        createdBy: 'Daine Vuignier',
        totalUser: 28
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CurrentListPage');
  }
  openContactList(){
    this.navCtrl.push(ContactListPage)
  }
}
