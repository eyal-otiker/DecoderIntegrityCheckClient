import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';
import swal from 'sweetalert2';
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public hide = true;
  private isExistUser : string = "";
  public userName : string = "";
  public password : string = "";
  public allFieldsRequired : boolean = false;

  constructor(private webSocketService : WebSocketService, private router : Router, private authGuard : AuthGuard) { }

  public ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  public setUserName(userName : string) : void {
    this.userName = userName;
    this.changeAllFieldsRequired();
  }

  public setPassword(password : string) : void {  
    this.password = password;
    this.changeAllFieldsRequired();
  }
  
  private changeAllFieldsRequired() : void {
    if (this.password != "" && this.userName != "" && this.allFieldsRequired == true) {
      this.allFieldsRequired = false;
    }
  }

  public moveToRegisterPage() : void {
    this.router.navigate(['register']); 
  }

  public login() : void {
    if (this.password == "" || this.userName == "") {
      this.allFieldsRequired = true; 
    }
    else {
        this.allFieldsRequired = false;      
        let dataArr : string[] = ["Login", this.userName, this.password];
        this.webSocketService.openWebSocket(dataArr).subscribe(
          (data : any) => {

            if (data == "True" || data == "False") {
              this.isExistUser = data;
            }
            else {
              if (data != "close" && data != "") {
                this.authGuard.userRole = data;
              }
              else if (data == "close") {
                switch (this.isExistUser)
                {
                  case "True":
                  {            
                    this.authGuard.userLoggedIn = true;
                    this.authGuard.userName = this.userName;
                    this.router.navigate(['home-page']); 
                    break;
                  }
                  case "False":
                  {
                    swal.fire({
                      icon: 'error',
                      text: "The password or user name incorrect"
                    })
                    break;
                  } 
                }
              }
            }
          }          
        );
    }
  }

}
