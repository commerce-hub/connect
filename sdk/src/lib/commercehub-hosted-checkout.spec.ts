import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommercehubHostedCheckout } from './commercehub-hosted-checkout';

describe('CommercehubHostedCheckout', () => {
  let component: CommercehubHostedCheckout;
  let fixture: ComponentFixture<CommercehubHostedCheckout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommercehubHostedCheckout]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommercehubHostedCheckout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
