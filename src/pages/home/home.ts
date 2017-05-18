import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import {DaylyMenu} from '../../model/DaylyMenu';
import {DataService} from '../../services/data.service';
import { LoadingController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit{
  dayList : DaylyMenu[];
  authToken : string;
  loading : any;
  constructor(public loadingCtrl: LoadingController, 
      public navCtrl: NavController, private dataService : DataService) {

  }

  presentLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Loading ...',
      duration: 2000,
      dismissOnPageChange: true
    }).present();
  }

  ngOnInit() {
    this.getMenu();
  }

  getMenu(){
    this.presentLoading();
    this.dataService.getMenu().subscribe(
                       response => {
                         this.dayList = response;
                         //this.loading.dismiss();
                       },
                       error => {
                        alert(error);
                       }
                     );   
  }
  
}
