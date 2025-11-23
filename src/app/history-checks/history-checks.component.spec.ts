import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryChecksComponent } from './history-checks.component';

describe('HistoryChecksComponent', () => {
  let component: HistoryChecksComponent;
  let fixture: ComponentFixture<HistoryChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HistoryChecksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
