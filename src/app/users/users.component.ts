import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { AuthGuard } from '../services/auth.guard';
import { MatTableDataSource } from '@angular/material/table';

export class UserData {
  user: string;
  userRole : string;
  userDecoderPermission : string;
  constructor() {
    this.user = "";
    this.userRole = "";
    this.userDecoderPermission = "";
  }
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  constructor(public webSocketService : WebSocketService, public authGuard : AuthGuard) { }

  private userData = new UserData();
  public usersDataArr : UserData[] = [];
  public displayedColumns = ["UserName", "Role", "DecoderPermission"];
  public dataSource! : MatTableDataSource<UserData>; 
  public usersDataArrLength : number = -1;

  ngOnInit(): void {
    window.scrollTo(0, 0);
    let dataArr : string[] = ["GetUsers"];
    this.webSocketService.openWebSocket(dataArr).subscribe(
      (data : any) => {
        if (data == "close") {
         
        }
        if (this.usersDataArrLength == -1) {
          this.usersDataArrLength = data;
        }
        else if (this.userData.user == "") {
          this.userData.user = data;
        } 
        else if (this.userData.userRole == "") {
          this.userData.userRole = data;
        } 
        else if (this.userData.userDecoderPermission == "") {
          this.userData.userDecoderPermission = data;
          this.usersDataArr.push(this.userData);
          this.dataSource = new MatTableDataSource<UserData>(this.usersDataArr);
          this.userData = new UserData();
        } 
      }
    );
  }

}
