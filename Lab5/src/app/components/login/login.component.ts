import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: String;
  password: String;
  active: Boolean;

  constructor(
    private authService:AuthService,
    private router:Router,
    private flashMessage:FlashMessagesService
  ) { }

  ngOnInit() {
  }

  onLoginSubmit(){
    const user = {
      email: this.email,
      password: this.password,
      active: this.active,
    }

    this.authService.authenticateUser(user).subscribe(data => {
      if(data.success){
        console.log(data);
        if (data.user.active == true) {
             this.authService.storeUserData(data.token, data.user);
             this.router.navigate(['dashboard']);
             this.flashMessage.show('You are now logged in!', {
             cssClass: 'alert-success',
             timeout: 3000});
        }
        else{
            this.flashMessage.show('Please verify your email', {
            cssClass: 'alert-danger',
            timeout: 3000});
          }
      }
       
      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger',
          timeout: 3000});
        this.router.navigate(['login']);
      }
    });
  }
}
