import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router, NavigationStart } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  public userLoggedIn : boolean = false;
  public userName : string = "";
  public isDecoderCheck = false;
  public userRole : string = "";

  constructor(private router : Router, private cookieService : CookieService) {}

  public canActivate(
    route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let usersDictionary : {[key : string] : string} = this.cookieService.getAll();
    let value = "";
    if (state.url=="/login" || state.url=="/register")
    {
      this.cookieService.deleteAll();
      this.userName = "";
      return true;
    }     
    else if (Object.keys(usersDictionary).length == 0 && this.userName == "") // when try to move pages without login
    {
      this.router.navigate(['login']);
      return false;
    }
    else // when move pages that user login (include refresh)
    {
      for (let key in usersDictionary) {
        value =  usersDictionary[key];
        break;
      }
      if ((this.isDecoderCheck == false && state.url=="/alert-collection") || (value != "Admin" && state.url=="/users")) {
        this.router.navigate(['home-page'])
        return false;
      }

      if (this.userName != "")
        this.cookieService.set(this.userName, this.userRole);
      else
        this.userName = this.findUserName(usersDictionary);
      
      this.isDecoderCheck = false;
      return true;
    }
  }

  private findUserName(usersDictionary : {[key : string] : string}) : string {
    for (let key in usersDictionary) {
      if (usersDictionary[key] == "User" || usersDictionary[key] == "Admin") {
        this.userRole = usersDictionary[key];
        return key
      }
    }

    return "";
  }
}
