import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadFilesService } from '../services/upload-files.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';
import { WebSocketService } from '../services/web-socket.service';
import { AlertCollectionComponent } from '../alert-collection/alert-collection.component';
import { AuthGuard } from '../services/auth.guard';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.css']
})
export class UploadFilesComponent implements OnInit {

  constructor(private uploadFilesService : UploadFilesService, private router : Router, 
    private formBuild : FormBuilder, private webSocketService : WebSocketService, public authGuard : AuthGuard) {
      this.icdFile = null;
      this.decoderFile = null; 
      this.alertCollection = new AlertCollectionComponent(this.webSocketService, this.uploadFilesService, this.authGuard);
    }

  public inIntroduction : boolean = true;
  public inCheckDecoder : boolean = false;

  public icdFile : any;
  public isUploadIncorrectIcdFile : boolean = false;
  public decoderFile : any;
  public isUploadIncorrectDecoderFile : boolean = false;
  
  public typesOfCheck : string[] = ["Easy", "Medium", "Deep", "Extra Deep"];
  public nativeCheckSelected : string = "Easy";
  public descriptionSelectedNativeCheck : string = "";

  private checkWithRandom : boolean = false;
  public isChooseThroughtCheck : boolean = false;

  public timeToCheckSelectedNativeCheck : string = "Calculate time...";
  private timeCheckDictionary : { [id: string] : string; } = {};

  private descriptionSerialSetsDictionary : { [id: string] : string; } = 
  { "Easy" : "Create sets with 2 values in maximum from each item. It takes the minimum and maximum value from each item.", 
  "Medium" : "Create sets with 7 values in maximun from each item. It takes the minimum value, maximum value and 5 values between them.", 
  "Deep" : "Create sets with 10 values in maximun from each item. It takes the minimum value, maximum value and 8 values between them.", 
  "Extra Deep" : "Create all the posible sets." };
  private descriptionRandomSetsDictionary : { [id: string] : string; } = 
  { "Easy" : "The number of sets we create is 0.1% of the num options.", 
  "Medium" : "The number of sets we create is 0.5% of the num options.", 
  "Deep" : "The number of sets we create is 1% of the num options.", 
  "Extra Deep" : "The number of sets we create is 50% of the num options" };
  
  private alertCollection : AlertCollectionComponent;

  public uploadIcdFormGroup = this.formBuild.group({
    uploadIcdCtrl: ['', Validators.required],
  });
  public uploadDecoderFormGroup = this.formBuild.group({
    uploadDecoderCtrl: ['', Validators.required],
  });
  public throughCheckFormGroup = this.formBuild.group({
    throughCheckCtrl : ['', Validators.required]
  })
  public nativeCheckFormGroup = this.formBuild.group({
    nativeCheckCtrl: ['Easy', Validators.required],
  });


  public ngOnInit() : void {
    window.scrollTo(0, 0);
  }

  public readUploadInstruction() : void
  {
    window.scroll(0, 0);
    this.inIntroduction = true;
    this.inCheckDecoder = false;
    this.icdFile = null;
    this.decoderFile = null;
    this.nativeCheckSelected = "";
    this.timeCheckDictionary = {};
    this.isUploadIncorrectIcdFile = false;
    this.isChooseThroughtCheck = false;
  }

  public letsUpload() : void
  {
    window.scroll(0, 0);
    this.inIntroduction = false;
    this.inCheckDecoder = true;
  }

  public onUploadIcdFile(event : any) : void 
  {
    if (event.target.files[0] == null || !((event.target.files[0].name as string).endsWith(".json"))) {
      this.icdFile = null;
      if (event.target.files[0] == null)
        this.isUploadIncorrectIcdFile = false;
      else
        this.isUploadIncorrectIcdFile = true;
    }
    else {
      this.icdFile = event.target.files[0]; 
      this.isUploadIncorrectIcdFile = false;
      this.onSendGetTimeCheck();
    }
  }

  public onUploadDataFile(event : any) : void
  {
    if (event.target.files[0] == null || !((event.target.files[0].name as string).endsWith(".ngp"))) {
      this.decoderFile = null;
      if (event.target.files[0] == null)
        this.isUploadIncorrectDecoderFile = false;
      else
        this.isUploadIncorrectDecoderFile = true;
    }
    else {
      this.decoderFile = event.target.files[0]; 
      this.isUploadIncorrectDecoderFile = false;
      this.onSendGetTimeCheck();
    }
  }

  public updateNativeCheck(checkType : string) : void {
    this.nativeCheckSelected = checkType;

    if (this.timeCheckDictionary[checkType] == undefined)
      this.timeToCheckSelectedNativeCheck = "Calculate time...";
    else
      this.timeToCheckSelectedNativeCheck = this.timeCheckDictionary[checkType];
    
    if (this.checkWithRandom == false) {
      this.descriptionSelectedNativeCheck = this.descriptionSerialSetsDictionary[checkType]; 
    }
    else {
      this.descriptionSelectedNativeCheck = this.descriptionRandomSetsDictionary[checkType];
    }
  }

  public updateIfCheckWithRandom(checkWithRandom : boolean) : void {
    this.checkWithRandom = checkWithRandom;
    this.timeToCheckSelectedNativeCheck = "Calculate time...";
    if (this.checkWithRandom == false) {
      this.descriptionSelectedNativeCheck = this.descriptionSerialSetsDictionary["Easy"];
    }
    else {
      this.descriptionSelectedNativeCheck = this.descriptionRandomSetsDictionary["Easy"];
    }

    this.isChooseThroughtCheck = true;
    this.onSendGetTimeCheck();
  }

  private onSendGetTimeCheck() : void
  {
    if (this.icdFile && this.decoderFile && this.isChooseThroughtCheck == true) {
      this.timeCheckDictionary = {};

      this.updateCheckTime();
      this.sendParametersForCheckDcoder(true);
    }
  }

  public sendParametersForCheckDcoder(isGetTimeCheck : boolean) : void
  {
    let formData = new FormData();  
    formData.append('file', this.icdFile); 
    formData.append('file', this.decoderFile);

    if (isGetTimeCheck == false) {
      formData.append(this.nativeCheckSelected, '');
      formData.append((String)(this.checkWithRandom), '');
      formData.append(this.authGuard.userName, '');
      this.authGuard.isDecoderCheck = true;
      this.router.navigate(['alert-collection']); 
      this.alertCollection.sendParametersToCheckDecoder(formData);
    }
    else {
      formData.append("", '');
      formData.append((String)(this.checkWithRandom), '');
      this.sendData(formData);
    }
  }

  private sendData(formData : FormData) : void {
    this.uploadFilesService.sendParametersToCheckDecoder(formData).subscribe(
      () => { },
      (httpErrorResponse : HttpErrorResponse) => {swal.fire({
        icon: 'error',
        text: httpErrorResponse.error
      })
      }
    )
  }

  private updateCheckTime() : void {
    let arr : string[] = ["Decoder"];
    let num = 0; let time : string = ""; let nativeName : string = "";

    this.webSocketService.openWebSocket(arr).subscribe(
      (data : any) => {
        num = Number(data);

        if (Number.isNaN(num)) {
          nativeName = data;
        }
        else {         
          time = this.calculateCheckTime(num);
          this.timeCheckDictionary[nativeName] = time;
          if (this.nativeCheckSelected == nativeName) {
            this.timeToCheckSelectedNativeCheck = time;
          }
          else if (this.nativeCheckSelected == "") {
            this.nativeCheckSelected = nativeName;
            this.timeToCheckSelectedNativeCheck = time;
          }
        }
      } 
    );
  }

  private calculateCheckTime(num : number) : string {
    let hour = 0; let min = 0; let sec = 0; 

    hour = Math.floor(num / 3600);
    num -= hour * 3600;
    min = Math.floor(num / 60);
    num -= min * 60;
    sec = num;
    return hour + " hours, " + min + " minutes, " + sec.toFixed(2) + " seconds";

  }
}

