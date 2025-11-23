import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-test-history-detail',
  templateUrl: './test-history-detail.component.html',
  styleUrls: ['./test-history-detail.component.css']
})
export class TestHistoryDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: {name: string, date: string, value: string, itemsName : string[]}) { }

  ngOnInit(): void {
  }

}
