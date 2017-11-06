import { ContactInfoPage } from './../contact-info/contact-info';
import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  contactList: Array<any> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contactList = [
      {
        firstName: 'Bruce',
        lastName: 'Ireland',
        snap: 'user-small-1.jpg',
        outletName: 'Torunto Sun',
        status: true
      },
      {
        firstName: 'Andrew',
        lastName: 'Ballard',
        snap: 'user-small-2.jpg',
        outletName: 'Ottawa Citizen',
        status: true
      },
      {
        firstName: 'Brigitte',
        lastName: 'Graney',
        snap: 'user-small-3.jpg',
        outletName: 'Calgary Herald',
        status: false
      },
      {
        firstName: 'Alan',
        lastName: 'Brancacio',
        snap: 'user-small-4.jpg',
        outletName: 'Calgary Herald',
        status: true
      }
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactListPage');
  }
  getStatus(status){
    if(status == true){
      return '(Online)'
    } else{
      return ''
    }
  }
  openContactInfo(){
    this.navCtrl.push(ContactInfoPage);
  }
}  
