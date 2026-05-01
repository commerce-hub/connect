import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app.config';
import { AngularBindingFixtureAppComponent } from './fixture-app.component';

bootstrapApplication(AngularBindingFixtureAppComponent, appConfig).catch((error: unknown) => {
  console.error(error);
});
