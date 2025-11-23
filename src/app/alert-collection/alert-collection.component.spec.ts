import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertCollectionComponent } from './alert-collection.component';

describe('AlertCollectionComponent', () => {
  let component: AlertCollectionComponent;
  let fixture: ComponentFixture<AlertCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertCollectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
