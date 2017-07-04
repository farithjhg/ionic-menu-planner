import { Component, OnInit, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {DataService} from '../services/data.service';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit{
 @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any}>;

  constructor(platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen, private dataService : DataService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      let authToken = localStorage.getItem('token');
    
      if(authToken == null || this.isTokenExpired()){
        this.rootPage = LoginPage;
      }else{
        this.rootPage = HomePage;
        this.pages = [
          { title: 'Home', component: HomePage },
          { title: 'Logout', component: LoginPage }
        ];      
      }
      
    });

  }


  /**
   * Check is the Token is expired
   */
  isTokenExpired() : Boolean{
    let expires_in = localStorage.getItem('expires_in');
    if(expires_in == null)
       return true;

    return new Number(expires_in) < Date.now()/1000;
  }

  ngOnInit() {
  }

  logout(){
    localStorage.removeItem('token');
    this.nav.setRoot(LoginPage);
  }

  goHome(){
    this.nav.push(HomePage);
  }
}
