import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommerceHubConnectSdk } from './commerce-hub-connect-sdk';

describe('CommerceHubConnectSdk', () => {
  let component: CommerceHubConnectSdk;
  let fixture: ComponentFixture<CommerceHubConnectSdk>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommerceHubConnectSdk]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommerceHubConnectSdk);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
