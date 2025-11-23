import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../services/web-socket.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  
  public hidePassword : boolean = true;
  public hideRepeatPassword : boolean = true;
  public userName : string = "";
  public password : string = "";
  public repeatPassword : string = "";
  public mustFillFields : boolean = false;
  public decoderPermissions : string[] = ["Only you", "Only you and admin", "Every one"];
  public decoderPermissionChosen : string = "";

  constructor(private webSocketService : WebSocketService, private router : Router) { }

  public ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  public moveToLoginPage() {
    this.router.navigate(['']); 
  }

  public setUserName(userName : string) {
    this.userName = userName;
    this.changeAllFieldsRequired();
  }

  public setPassword(password : string) {
    this.password = password;
    this.changeAllFieldsRequired();
  }
  
  public setRepeatPassword(repeatPassword : string) {
    this.repeatPassword = repeatPassword;
    this.changeAllFieldsRequired();
  }

  public setDecoderPremission(decoderPermissionChosen : string) {
    for (let i = 0; i < this.decoderPermissions.length; i++) {
      if (decoderPermissionChosen == this.decoderPermissions[i]) {
        this.decoderPermissionChosen = i.toString();
        break;
      }
    }
    this.changeAllFieldsRequired();
  }

  private changeAllFieldsRequired() : void {
    if (this.password != "" && this.repeatPassword != "" && this.userName != "" && this.decoderPermissionChosen != "" && this.mustFillFields == true) {
      this.mustFillFields = false;
    }
  }

  public signUp() {
    if (this.password == "" || this.repeatPassword == "" || this.userName == "" || this.decoderPermissionChosen == "") {
      this.mustFillFields = true;
    }
    else {
      this.mustFillFields = false;
      if (this.repeatPassword == this.password) {
        let dataArr : string[] = ["Register", this.userName, this.password, this.decoderPermissionChosen];
        this.webSocketService.openWebSocket(dataArr).subscribe(
          (data : any) => {
            switch (data)
            {
              case "True":
              {
                swal.fire({
                  icon: 'success',
                  text: "Your user added successfully"
                })
                break;
              }
              case "False":
              {
                swal.fire({
                  icon: 'error',
                  text: "This user name exist. Please change to another user name"
                })
                break;
              } 
            }
          }
        );
      }
    }
  }

}
