import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { AngularBindingExampleAppComponent } from './example-app.component';

describe('AngularBindingExampleAppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularBindingExampleAppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
  });

  it('creates the example app', () => {
    const fixture = TestBed.createComponent(AngularBindingExampleAppComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('renders the initial example status', () => {
    const fixture = TestBed.createComponent(AngularBindingExampleAppComponent);
    fixture.detectChanges();

    const rootElement: HTMLElement = fixture.nativeElement;
    expect(rootElement.textContent).toContain('Create an interaction to mount the Angular binding.');
    expect(rootElement.textContent).toContain('Commerce Hub Angular Binding');
  });
});
