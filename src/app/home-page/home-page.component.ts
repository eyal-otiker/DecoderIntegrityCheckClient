import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {


  public inCheckDecoderIntroduction : boolean = true;
  public inHistroyCheckInstruction : boolean = false;

  constructor(public authGuard : AuthGuard) {  }

  public ngOnInit() : void { 
    window.scrollTo(0, 0);
  }

  public readCheckDecoderIntroduction() : void {
    this.inCheckDecoderIntroduction = true;
    this.inHistroyCheckInstruction = false;
  }

  public readHistoryCheckIntroduction() : void {
    this.inCheckDecoderIntroduction = false;
    this.inHistroyCheckInstruction = true;
  }

}
