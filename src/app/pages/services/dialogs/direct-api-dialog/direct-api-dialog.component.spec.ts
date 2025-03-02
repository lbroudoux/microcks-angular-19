import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectApiDialogComponent } from './direct-api-dialog.component';

describe('DirectApiDialogComponent', () => {
  let component: DirectApiDialogComponent;
  let fixture: ComponentFixture<DirectApiDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectApiDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectApiDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
