import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketService } from '../services/web-socket.service';
import { UploadFilesService } from '../services/upload-files.service';
import { HttpEventType } from '@angular/common/http';
import { AuthGuard } from '../services/auth.guard';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { MatDialog } from '@angular/material/dialog';
import { TestHistoryDetailComponent } from '../test-history-detail/test-history-detail.component';
import { FormControl } from '@angular/forms';

enum ResultOptions {
  Proper,
  NotProper,
  NotValid
}

export class HistoryCheckItem {
  decoderName : string;
  clientDecoderLocation : string;
  dataLink : string;
  decoderVersion : string;
  decoderWritingDate : string;
  icdType : string;
  checkDate : string;
  nativeCheck : string;
  throughtCheck : string;
  countProper: string;
  countNotProper : string;
  countNotValid : string;

  constructor() 
  {
    this.decoderName = "";
    this.clientDecoderLocation = "";
    this.dataLink = "";
    this.decoderVersion = "";
    this.decoderWritingDate = "";
    this.icdType = "";
    this.checkDate = "";
    this.nativeCheck = "";
    this.throughtCheck = "";
    this.countProper = "";
    this.countNotProper = "";
    this.countNotValid = "";
  }
}

export class HistoryCheckItemGraphTable {
  name : string;
  value : number;

  constructor() 
  {
    this.name = "";
    this.value = 0;
  }
}

export class HistoryCheckItemGraphLastChecks {
  name : string;
  properItems : string[];
  notProperItems : string[];
  notValidItems : string[];

  constructor() 
  {
    this.name = "";
    this.properItems = [];
    this.notProperItems = [];
    this.notValidItems = [];
  }
}

export class HistoryCheckItemGraphMonths {
  name : string;
  series : HistoryCheckItemGraphTable[];

  constructor() 
  {
    this.name = "";
    this.series = [];
  }
}

@Component({
  selector: 'app-history-checks',
  templateUrl: './history-checks.component.html',
  styleUrls: ['./history-checks.component.css']
})
export class HistoryChecksComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  public inHidtoryCheckIntroduction : boolean = true;
  public inHistoryCheckFilterTable : boolean = false;
  public inHistoryCheckFilterGraph : boolean = false;

  public decoderName : string = "";
  public decoderNamesArr : string[] = [];
  private lengthNamesArr : number = -1;
  public icdType : string = "";
  public icdTypesArr : string[] = [];
  private lengthTypesArr : number = -1;
  public throughtCheck : string = "";
  public throughtCheckArr : string[] = [];
  private lengthThroughtCheckArr : number = -1;
  public nativeCheck : string = "";
  public nativeCheckArr : string[] = [];
  private lengthNativeCheckArr : number = -1;
  public decoderVersion : string = "";
  public decoderVersionsArr : string[] = [];
  private lengthDecoderVersionArr : number = -1;
  public disableSelect : FormControl = new FormControl(true);
  public isFillAllParametersInFilterGraph : boolean = true;
  
  public historyChecksArr : HistoryCheckItem[] = [];
  public historyChecksLength : number = -1;
  private historyCheckItem : HistoryCheckItem = new HistoryCheckItem();
  public displayedColumns = ["Decoder Name", "Data Link", "Decoder Version", "Decoder Writing Date", "Check Date",
   "Icd Type", "Throught Check", "Native Check", "Count Proper", "Count Not Proper", "Count Not Valid", "Download"];

  dataSource! : MatTableDataSource<HistoryCheckItem>; 

  public historyCheckGraphLastChecks : any[] = [];
  public historyCheckGraphLastChecksNotDisplay : HistoryCheckItemGraphLastChecks[] = [];
  public lengthHistoryCheckGraphLastChecks : number = -1;
  public historyCheckGraphMonths : HistoryCheckItemGraphMonths[] = [];
  private series : HistoryCheckItemGraphTable[] = [];
  public lengthHistoryCheckGraphMonths : number = -1;
  private historyCheckItemGraph = new HistoryCheckItemGraphTable();
  view: [number, number] = [700, 370];
  // options
  legendTitle: string = 'CheckDate';
  legendTitleMulti: string = '';
  legendPosition: LegendPosition = LegendPosition.Below; // ['right', 'below']
  legend: boolean = true;
  white : string = "white";
  xAxis: boolean = true;
  yAxis: boolean = true;
  yAxisLabel: string = 'Precent Of Values (%)';
  xAxisLabel: string = 'Check Date';
  xAxisLabelMonths: string = 'Check Date (In month)';
  yAxisLabelMonths : string = 'grade';
  showXAxisLabel: boolean = true;
  showYAxisLabel: boolean = true;
  maxXAxisTickLength: number = 30;
  maxYAxisTickLength: number = 30;
  trimXAxisTicks: boolean = false;
  trimYAxisTicks: boolean = false;
  rotateXAxisTicks: boolean = false;
  yAxisTicks: any[] = [0, 20, 40, 60, 80, 100]
  animations: boolean = true; // animations on load
  showGridLines: boolean = true; // grid lines
  showDataLabel: boolean = true; // numbers on bars
  gradient: boolean = false;
  customColors = [{name: "Proper", value: '#4B852C'}, 
  {name: "Not Proper", value: '#ffa500'} ,
  {name: "Not Valid", value: '#ff0000'}];
  schemeType: ScaleType = ScaleType.Ordinal; // 'ordinal' or 'linear'
  activeEntries: any[] = ['book']
  barPadding: number = 5
  tooltipDisabled: boolean = false;
  roundEdges: boolean = true;
  timeline: boolean = true;

  constructor(public webSocketService : WebSocketService, private downloadServiece : UploadFilesService, public authGuard : AuthGuard, public dialog: MatDialog) 
  { Object.assign(this, this.historyCheckGraphLastChecks); Object.assign(this, this.historyCheckGraphMonths); }

  public ngOnInit(): void {
    window.scrollTo(0, 0);
    let dataArr : string[] = ["FilterOptions", this.authGuard.userName];
    this.webSocketService.openWebSocket(dataArr).subscribe(
      (data : any) => {
        if (this.lengthNamesArr == -1)
          this.lengthNamesArr = Number(data);
        else if (this.lengthNamesArr > this.decoderNamesArr.length)
          this.decoderNamesArr.push(data);
        else if (this.lengthTypesArr == -1)
          this.lengthTypesArr = Number(data);    
        else if (this.lengthTypesArr > this.icdTypesArr.length)
          this.icdTypesArr.push(data);
        else if (this.lengthThroughtCheckArr == -1)
          this.lengthThroughtCheckArr = Number(data);
        else if (this.lengthThroughtCheckArr > this.throughtCheckArr.length)
          this.throughtCheckArr.push(data);
        else if (this.lengthNativeCheckArr == -1)
          this.lengthNativeCheckArr = Number(data);   
        else if (this.lengthNativeCheckArr > this.nativeCheckArr.length)
          this.nativeCheckArr.push(data);
        
      }
    );
  }

  public readHistoryCheckInstruction() : void {
    this.inHidtoryCheckIntroduction = true;
    this.inHistoryCheckFilterTable = false;
    this.inHistoryCheckFilterGraph = false;
    this.resetParameters();
  }

  public letsFilterInTable() : void {
    this.inHidtoryCheckIntroduction = false;
    this.inHistoryCheckFilterTable = true;
    this.inHistoryCheckFilterGraph = false;
    // this.changeOptionsArrTable();
    this.resetParameters();
  }

  public letsFilterInGraph() : void {
    this.inHidtoryCheckIntroduction = false;
    this.inHistoryCheckFilterTable = false;
    this.inHistoryCheckFilterGraph = true;
    this.isFillAllParametersInFilterGraph = true;
    // this.changeOptionsArrGraph();
    this.resetParameters();
  }

  private resetParameters() : void {
    window.scrollTo(0, 0);
    this.decoderName = "";
    this.icdType = "";
    this.throughtCheck = "";
    this.nativeCheck = "";
    this.decoderVersion = "";
    this.decoderVersionsArr = [];
    this.lengthDecoderVersionArr = -1;
    this.historyChecksArr = [];
    this.historyChecksLength = -1;
    this.historyCheckGraphLastChecks = [];
    this.lengthHistoryCheckGraphLastChecks = -1;
    this.historyCheckGraphMonths = [];
    this.lengthHistoryCheckGraphMonths = -1;
    this.historyCheckGraphLastChecksNotDisplay = [];
    this.disableSelect = new FormControl(false);
    // this.valueProper = 0;
    // this.valueNotProper = 0;
    // this.valueNotValid = 0;
  }

  public updateDecoderName(name : string) : void {
    if (this.decoderName != name) {
      this.decoderName = name;
      if (this.inHistoryCheckFilterGraph == true) {
        this.disableSelect = new FormControl(false);
        this.decoderVersion = "";
        this.decoderVersionsArr = [];
        this.lengthDecoderVersionArr = -1;
        this.getDecoderVersions();
      }
    }  
  }

  public getDecoderVersions() : void {
    let dataArr : string[] = ["DecoderVersionOptions", this.authGuard.userName, this.decoderName];
    this.webSocketService.openWebSocket(dataArr).subscribe(
      (data : any) => {
       if (this.lengthDecoderVersionArr == -1) {
        this.lengthDecoderVersionArr = data;
       }
       else if (data != "close") {
        this.decoderVersionsArr.push(data);
       }
      }
    );
  }

  public updateDecoderVersion(decoderVersion : string) : void {
    this.decoderVersion = decoderVersion;
  }

  public updateIcdType(icdType : string) : void {
    this.icdType = icdType;
  }

  public updateThroughtCheck(throughtCheck : string) : void {
    this.throughtCheck = throughtCheck;
  }

  public updateNativeCheck(nativeCheck : string) : void {
    this.nativeCheck = nativeCheck;
  }

  public filterHistoryChecks() : void {
    let dataArr : string[] = ["FilterTable", this.authGuard.userName, this.decoderName, this.icdType, this.throughtCheck, this.nativeCheck];
    this.historyChecksArr = [];
    this.historyChecksLength = -1;

    this.webSocketService.openWebSocket(dataArr).subscribe(
      (data : any) => {
        if (data == "close") {

        }
        else if (this.historyChecksLength == -1) {
          this.historyChecksLength = Number(data);
        }
        else if (this.historyCheckItem.decoderName == "") {
          this.historyCheckItem.decoderName = data;
        }
        else if (this.historyCheckItem.clientDecoderLocation == "") {
          this.historyCheckItem.clientDecoderLocation = data;
        }
        else if (this.historyCheckItem.dataLink == "") {
          this.historyCheckItem.dataLink = data;
        }
        else if (this.historyCheckItem.decoderVersion == "") {
          this.historyCheckItem.decoderVersion = data;
        }
        else if (this.historyCheckItem.decoderWritingDate == "") {
          this.historyCheckItem.decoderWritingDate = data;
        }
        else if (this.historyCheckItem.checkDate == "") {
          this.historyCheckItem.checkDate = data;
        }
        else if (this.historyCheckItem.icdType == "") {
          this.historyCheckItem.icdType = data;
        }
        else if (this.historyCheckItem.throughtCheck == "") {
          this.historyCheckItem.throughtCheck = data;
        } 
        else if (this.historyCheckItem.nativeCheck == "") {
          this.historyCheckItem.nativeCheck = data;
        }        
        else if (this.historyCheckItem.countProper == "") {
          this.historyCheckItem.countProper = data;
        }  
        else if (this.historyCheckItem.countNotProper == "") {
          this.historyCheckItem.countNotProper = data;
        }
        else if (this.historyCheckItem.countNotValid == "") {
          this.historyCheckItem.countNotValid = data;
          this.historyChecksArr.push(this.historyCheckItem);
          this.dataSource = new MatTableDataSource<HistoryCheckItem>(this.historyChecksArr);
          this.dataSource.paginator = this.paginator;      
          this.historyCheckItem = new HistoryCheckItem();
        }
      } 
    );
  }

  public filterHistoryCheckGraph() : void  {
    if (/*this.valueProper + this.valueNotProper + this.valueNotValid == 100 &&*/ this.decoderName && this.decoderVersion && this.icdType && this.throughtCheck && this.nativeCheck)
    {
      this.isFillAllParametersInFilterGraph = true;
      let dataArr : string[] = ["FilterGraph", this.authGuard.userName, this.decoderName, this.icdType, this.throughtCheck, this.nativeCheck, this.decoderVersion];
      let resultType : ResultOptions = 2;
      this.historyCheckItem = new HistoryCheckItem();
      this.historyCheckGraphLastChecks = [];
      this.lengthHistoryCheckGraphLastChecks = -1;
      this.historyCheckGraphMonths = [];
      this.lengthHistoryCheckGraphMonths = -1;
      this.historyCheckGraphLastChecksNotDisplay = [];
      this.series = [];
      this.historyCheckItemGraph = new HistoryCheckItemGraphTable();
      let properLength : number = -1;
      let notProperLength : number = -1;
      let notValidLength : number = -1;
      let properList : string[] = [];
      let notProperList : string[] = [];
      let notValidList : string[] = [];

      this.webSocketService.openWebSocket(dataArr).subscribe(
        (data : any) => {
          if (data == "close") {
  
          }
          else if (this.lengthHistoryCheckGraphLastChecks == -1 || this.historyCheckGraphLastChecks.length < this.lengthHistoryCheckGraphLastChecks ||
            this.historyCheckGraphLastChecksNotDisplay.length < this.lengthHistoryCheckGraphLastChecks)
          {
            if (this.lengthHistoryCheckGraphLastChecks == -1) {
              this.lengthHistoryCheckGraphLastChecks = data;
            }
            else if (this.historyCheckItem.checkDate == "") {
              this.historyCheckItem.checkDate = data;
            }
            else if (this.historyCheckItem.countProper == "") {
              this.historyCheckItem.countProper = data;
            }  
            else if (this.historyCheckItem.countNotProper == "") {
              this.historyCheckItem.countNotProper = data;
            }
            else if (this.historyCheckItem.countNotValid == "") {
              this.historyCheckItem.countNotValid = data;
    
              this.historyCheckGraphLastChecks.push({
                "name": this.historyCheckItem.checkDate.split(':')[0] + ":" + this.historyCheckItem.checkDate.split(':')[1],
                "series": [
                  {
                    "name": "Proper",
                    "value": this.historyCheckItem.countProper.replace('%', '')
                  }, {
                    "name": "Not Proper",
                    "value": this.historyCheckItem.countNotProper.replace('%', '')
                  }, {
                    "name": "Not Valid",
                    "value": this.historyCheckItem.countNotValid.replace('%', '')
                  }
                ]
              })
              
            }
            else if (data == "Proper") 
              resultType = 0;
            else if (data == "NotProper") 
              resultType = 1;
            else if (data == "NotValid") 
              resultType = 2;
            else {
              if (resultType == 0 || properList.length < properLength) {
                if (properLength == -1) {
                  properLength = Number(data);
                }
                else if (properList.length < properLength) {
                  properList.push(data);
                }
              }
              else if (resultType == 1 || notProperList.length < notProperLength) {
                if (notProperLength == -1) {
                  notProperLength = Number(data);
                }
                else if (notProperList.length < notProperLength) {
                  notProperList.push(data);
                }
              }
              else if (resultType == 2 || notValidList.length < notValidLength) {
                if (notValidLength == -1) {
                  notValidLength = Number(data);
                }
                else if (notValidList.length < notValidLength) {
                  notValidList.push(data);
                }

                if (properList.length + notProperList.length + notValidList.length == properLength + notProperLength + notValidLength) {
                  this.historyCheckGraphLastChecksNotDisplay.push({
                    "name": this.historyCheckItem.checkDate.split(':')[0] + ":" + this.historyCheckItem.checkDate.split(':')[1],
                    "properItems": properList,
                    "notProperItems": notProperList,
                    "notValidItems": notValidList                
                  })
    
                  properList = [];
                  properLength = -1;
                  notProperList = [];
                  notProperLength = -1;
                  notValidList = [];
                  notValidLength = -1;
                  this.historyCheckItem = new HistoryCheckItem();
                }
              }
            }            
          }
          else {
            if (this.lengthHistoryCheckGraphMonths == -1) {
              this.lengthHistoryCheckGraphMonths = data;
            }
            else if (this.historyCheckItemGraph.name == "") {
              this.historyCheckItemGraph.name = data;
            }
            else if (this.historyCheckItemGraph.value == 0) {
              this.historyCheckItemGraph.value = data;
    
              this.series.push({"name": this.historyCheckItemGraph.name, "value": this.historyCheckItemGraph.value});
              if (this.historyCheckGraphMonths.length == 0) {            
                this.historyCheckGraphMonths.push({"name": "grade", "series": this.series});
              }
              else {
                this.historyCheckGraphMonths[0].series = this.series;
              }
              this.historyCheckGraphMonths = [...this.historyCheckGraphMonths];
              this.historyCheckItemGraph = new HistoryCheckItemGraphTable();
            }
          }       
        } 
      );  
    }
    else {
      this.isFillAllParametersInFilterGraph = false;
    }
  }

  public downloadDecoder(element : HistoryCheckItem) : void {
    this.downloadServiece.downloadFile(element.clientDecoderLocation).subscribe(
      data => {
        switch (data.type) {
          case HttpEventType.Response:
            if (data.body != null)
            {
              const downloadedFile = new Blob([data.body], { type: data.body.type });
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.download = element.decoderName + ".ngp";
              a.href = URL.createObjectURL(downloadedFile);
              a.target = '_blank';
              a.click();
              document.body.removeChild(a);
              break;
            }          
        }
      }
    )

  }

  onSelect(event: any) : void {
    if (event.value != undefined)
    {
      let parameters : string[] = []; 
      for (let i = 0; i < this.historyCheckGraphLastChecksNotDisplay.length; i++) {
        if (this.historyCheckGraphLastChecksNotDisplay[i].name == event.series) {
          if (event.name == "Proper") {
            parameters = this.historyCheckGraphLastChecksNotDisplay[i].properItems;
          }
          if (event.name == "Not Proper") {
            parameters = this.historyCheckGraphLastChecksNotDisplay[i].notProperItems;
          }
          if (event.name == "Not Valid") {
            parameters = this.historyCheckGraphLastChecksNotDisplay[i].notValidItems;
          }
        }
      }
  
      this.dialog.open(TestHistoryDetailComponent, {data: {name: event.name, date: event.series, value: event.value, itemsName: parameters} });
    }
  }

}


