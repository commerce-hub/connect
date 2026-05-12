import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from './app.config';
import { AngularBindingExampleAppComponent } from './example-app.component';

bootstrapApplication(AngularBindingExampleAppComponent, appConfig).catch((error: unknown) => {
  console.error(error);
});
