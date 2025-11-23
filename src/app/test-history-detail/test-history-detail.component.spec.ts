import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestHistoryDetailComponent } from './test-history-detail.component';

describe('TestHistoryDetailComponent', () => {
  let component: TestHistoryDetailComponent;
  let fixture: ComponentFixture<TestHistoryDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TestHistoryDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestHistoryDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
