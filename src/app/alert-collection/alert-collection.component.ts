import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {GridsterConfig, GridsterItem, GridType, CompactType} from 'angular-gridster2';
import { UploadFilesService } from '../services/upload-files.service';
import { WebSocketService } from '../services/web-socket.service';
import swal from 'sweetalert2';
import { AuthGuard } from '../services/auth.guard';


export class CheckItem {
  name : string;
  properItems: string[];
  notProperItems : string[];
  notValidItems : string[];
  timeToCheck : string;
  countNumberAlert : number[]; // countPropperNumber, countNotPropperNumber, countNotValid, precentPropper, precentNotPropper, precentNotValid

  constructor(name : string) {
    this.name = name;
    this.properItems = [];
    this.notProperItems = [];
    this.notValidItems = [];
    this.timeToCheck = "";
    this.countNumberAlert = [];
  }
}

export class GaugeCollection {
  name : string;
  backgroundColor : string;
  foregroundColor: string;
  thick: number;
  size: number;
  type: string;
  value: number;
  max: number;
  append: string;
  label: string

  constructor(name : string, foregroundColor : string, value : number, label : string)
  {
    this.name = name;
    this.backgroundColor = "white";
    this.foregroundColor = foregroundColor;
    this.thick = 12;
    this.size = 220;
    this.type = "semi";
    this.value = value;
    this.max = 100;
    this.append = "%";
    this.label = label;
  }
}

@Component({
  selector: 'app-alert-collection',
  templateUrl: './alert-collection.component.html',
  styleUrls: ['./alert-collection.component.css']
})
export class AlertCollectionComponent implements OnDestroy, OnInit {

  private isClosePage : boolean = false;
  public nativeCheckSelected : string = "";
  public throughtCheckDescription : string = "";
  public decoderName : string = "";
  public decoderDataLink : string = "";
  public decoderVersion: string = "";
  public decoderWritingDate : string = "";

  public gaugeNameList: string[] = [];
  public isFinishCheck : boolean = false;
  
  public green:string="green"
  public red:string="red";
  public orange:string="orange";
  public purple:string="purple";

  private countNumberAlertSum : number[] = [0, 0, 0, 0, 0, 0]; // countPropperNumber, countNotPropperNumber, countNotValid, precentPropper, precentNotPropper, precentNotValid
  private countNumberAlertAvg : number[] = [0, 0, 0, 0, 0, 0]; // countPropperNumber, countNotPropperNumber, countNotValid, precentPropper, precentNotPropper, precentNotValid
  private sumOfItemAvg : number = 0;

  private timeToCheckSum : number = 0;
  private timeToCheckAvg : number = 0;
  public timeToCheckAvgString : string = "";

  public numOfFrameCheck : number = 0;
  public precentFrameCheck : number = 0;

  private numOfOptions : number = 0;
  public numOfCheckedOptions : number = 0;
  private precentOptionsChecks : number = 0;

  private checkItem = new CheckItem("");
  public checkItemsArr : CheckItem[] = [];
  
  public options!: GridsterConfig;
  public dashboard!: Array<GridsterItem>;

  public gaugeParameters : { [id: string] : GaugeCollection; } = 
  {"Propper Gauge" : new GaugeCollection("Proper Gauge", "green", this.countNumberAlertAvg[3], this.countNumberAlertAvg[0] +  " / " + this.sumOfItemAvg +  " proper items in average"),
  "Not Propper Gauge" : new GaugeCollection("Not Proper Gauge", "orange", this.countNumberAlertAvg[4], this.countNumberAlertAvg[1] +  " / " + this.sumOfItemAvg +  " not proper items in average"),
  "Not Valid Gauge" : new GaugeCollection("Not Valid Gauge", "red", this.countNumberAlertAvg[5], this.countNumberAlertAvg[2] +  " / " + this.sumOfItemAvg +  " not valid items in average"),
  "Checked Gauge" : new GaugeCollection("Checked Gauge", "purple", this.precentOptionsChecks, this.numOfCheckedOptions +  " / " + this.numOfOptions + " sets were checked")};
  
  public cardInformation : { [id: string] : string } = 
  { "Proper Gauge" : "This gauge presents the number of items that there value  worth to the original value from the frame. The gauge displays the number of proper items on average in numberical value and on percentage.", 
  "Not Proper Gauge" : "This gauge presents the number of items that there value are not worth to the original value from the frame and is in the range of the values that can be this value item according to the ICD file. The gauge displays the number of not proper items on average in numberical value and on percentage.", 
  "Not Valid Gauge" : "This gauge presents the number of items that there value are not worth to the original value from the frame and is not in the range of the values that can be this value item according to the ICD file. The gauge displays the number of not valid items on average in numberical value and on percentage.",
  "Checked Gauge" : "This gauge presents the number of sets that checked of the number of optional sets. You can see the data in numberical value and in precentage."
  };

  constructor(private webSocketService : WebSocketService, private uploadFilesService : UploadFilesService, public authGuard : AuthGuard) { }

  public ngOnInit() : void {
    window.scrollTo(0, 0);

    this.options = {
      gridType: GridType.Fit,
      compactType: CompactType.None,
      pushItems: false,
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      }
    };

    this.dashboard = [{x: 0, y: 0, cols: 2, rows: 2, propName: "Propper Gauge"},
      {x: 0, y: 2, cols: 2, rows: 2, propName: "Not Propper Gauge"},
      {x: 2, y: 0, cols: 2, rows: 2, propName: "Not Valid Gauge"},
      {x: 2, y: 2, cols: 2, rows: 2, propName: "Checked Gauge"}];

    this.getAlertCollection();

  }

  private getAlertCollection() : void {
    let arr : string[] = ["Decoder"];

    this.webSocketService.openWebSocket(arr).subscribe(
      (data : any) => {
        let num : number = Number(data);

        if (data == "close" && this.isClosePage == false) {
          this.isFinishCheck = true;
          this.dashboard = [{x: 0, y: 0, cols: 1, rows: 1, propName: "Propper Gauge"},
          {x: 0, y: 1, cols: 1, rows: 1, propName: "Not Propper Gauge"},
          {x: 1, y: 0, cols: 1, rows: 1, propName: "Not Valid Gauge"},
          {x: 1, y: 1, cols: 1, rows: 1, propName: "Checked Gauge"}];
          this.gaugeNameList = [];
          swal.fire({
            icon: 'info',
            text: "The check finished. Now you can see the final results."
          })
        }
        else if (!Number.isNaN(num)) {
          this.updateNumericalData(num);
        }
        else {
          let returnData : string = this.updateGeneralVerbalData(data);
          if (returnData == "") {
            this.updateCheckVerbalData(data);
          }
        }      
      } 
    );
  }

  public async sendParametersToCheckDecoder(formData : FormData) : Promise<void> {
    await new Promise(f => setTimeout(f, 1000));

    this.uploadFilesService.sendParametersToCheckDecoder(formData).subscribe(
      () => { },
      (httpErrorResponse : HttpErrorResponse) => {swal.fire({
        icon: 'error',
        text: httpErrorResponse.error
      })
      }
    )
  }

  public ngOnDestroy(): void {
   this.webSocketService.closeWebSocket();
  }

  public closePage() : void {
    this.webSocketService.closeWebSocket();
    this.isClosePage = true;
  }

  private updateNumericalData(data : number) : void {

    if (this.numOfOptions == 0)
      this.numOfOptions = data;
    else if (this.numOfFrameCheck == 0) {
      this.numOfFrameCheck = Number(data.toFixed(0));
      // this.numOfFrameCheck = 20; // delete row
    }
    else if (this.checkItem.timeToCheck == "") {
      this.setTimeToCheckAvg(data);
    }
    else
    {
      let location : number = this.checkItem.countNumberAlert.length;
      this.checkItem.countNumberAlert[location] = data;
      this.countNumberAlertSum[location] += data;
      this.countNumberAlertAvg[location] = Number((this.countNumberAlertSum[location] / (this.checkItemsArr.length + 1)).toFixed(1));
      this.updateGaugeParmeters(location, this.countNumberAlertAvg[location], -1);  
    }
    
    if (this.checkItem.countNumberAlert.length == 6) {
      this.sumOfItemAvg = this.countNumberAlertAvg[0] + this.countNumberAlertAvg[1] + this.countNumberAlertAvg[2];

      this.numOfCheckedOptions++;
      this.precentFrameCheck = (this.numOfCheckedOptions / this.numOfFrameCheck) * 100;
      this.precentOptionsChecks = (this.numOfCheckedOptions / this.numOfOptions) * 100;
      this.updateGaugeParmeters(-1, this.precentOptionsChecks, this.numOfCheckedOptions); 

      this.checkItemsArr.push(this.checkItem);
      this.checkItem = new CheckItem("");
    }  
  }

  private updateGeneralVerbalData(data : string) : string {
    if (this.nativeCheckSelected == "") {
      this.nativeCheckSelected = data;
    }
    else if (this.throughtCheckDescription == "") {
      if (data == "True") {
        this.throughtCheckDescription = "Random Sets";
      }
      else {
        this.throughtCheckDescription = "Serial Sets";
      }
    }
    else if (this.decoderName == "") {
      this.decoderName = data;
    }
    else if (this.decoderDataLink == "") {
      this.decoderDataLink = data;
    }
    else if (this.decoderVersion == "") {
      this.decoderVersion = data;
    }
    else if (this.decoderWritingDate == "") {
      this.decoderWritingDate = data;
    }
    else {
      data = "";
    }
    return data;
  }

  private updateCheckVerbalData(data : string) : void {
    if (this.checkItem.name == "") {
      this.checkItem.name = data
    }
    else if (data.includes("not proper")) {
      this.checkItem.notProperItems.push(data.replace("not proper", ''));    
    }
    else if (data.includes("proper")) {
      this.checkItem.properItems.push(data.replace("proper", ' '))    
    }
    else if (data.includes("not valid")) {
      this.checkItem.notValidItems.push(data.replace("not valid", ' '));    
    }  
  }

  private setTimeToCheckAvg(timeToCheck : any) : void {
    this.checkItem.timeToCheck = timeToCheck;
    this.timeToCheckSum += timeToCheck;
    this.timeToCheckAvg = this.timeToCheckSum / this.checkItemsArr.length;
    this.timeToCheckAvgString = this.timeToCheckAvg.toFixed(5);
  }

  private updateGaugeParmeters(location : number, firstParameter : number, secondParameter : number) : void {
    switch (location)
    {
      case -1:
      {
        this.gaugeParameters["Checked Gauge"].value = firstParameter;
        this.gaugeParameters["Checked Gauge"].label = secondParameter +  " / " + this.numOfOptions + " sets were checked";
        break;
      }
      case 0:
      {
        this.gaugeParameters["Propper Gauge"].label = firstParameter +  " / " + this.sumOfItemAvg +  " proper items in average";
        break;
      }
      case 1:
      {
        this.gaugeParameters["Not Propper Gauge"].label = firstParameter +  " / " + this.sumOfItemAvg +  " not proper items in average";
        break;
      }
      case 2:
      {
        this.gaugeParameters["Not Valid Gauge"].label = firstParameter +  " / " + this.sumOfItemAvg +  " not valid items in average";
        break;
      }
      case 3:
      {
        this.gaugeParameters["Propper Gauge"].value = firstParameter;
        break;
      }
      case 4:
      {
        this.gaugeParameters["Not Propper Gauge"].value = firstParameter;
        break;
      }
      case 5:
      {
        this.gaugeParameters["Not Valid Gauge"].value = firstParameter;
        break;
      }
    }
  }

}

