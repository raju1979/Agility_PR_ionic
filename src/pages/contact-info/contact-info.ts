import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-contact-info',
  templateUrl: 'contact-info.html',
})
export class ContactInfoPage {
  contactInfo: {};

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.contactInfo = {
      firstName: 'James',
      lastName: 'Smith',
      snap:'user-big-1.jpg',
      tagline: 'Journalist',
      outlet: 'Ottawa Citizen',
      status: true,
      contact: {
        addressLine1: '54, South Pearl St',
        addressLine2: 'Ottawa Ontario K1R W3E',
        addressLine3: 'Canada',
        email:'james.smith@ottawacitizen.com',
        phoneNumber1: '1 613-462-5354',
        phoneNumber2: '1 613-351-3146',
        faxNumber: '1 613.829.9100'
      },
      website: 'www.ottawacitizen.com',
      subjects: ['Local News', 'Regional Interest'],
      jobRole: 'Reporter',
      languages: ['English'],
      coverage: 'Ontario, Ottawa',
      profile: '',
      location: {
        lat: '',
        long: ''
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactInfoPage');
  }

  getStatus(status){
    if(status == true){
      return '(Online)'
    } else{
      return ''
    }
  }
}
