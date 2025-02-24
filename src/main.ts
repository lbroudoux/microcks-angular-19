import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Load Keycloak config from server. Need to do this before invoking
// keycloak-js constructor to first check the enabled flag.
let keycloakConfig: any;
console.log('[Microcks launch] Origin: ' + location.origin);

function getKeycloakConfig(callback: any) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', location.origin + '/api/keycloak/config', true);
  xhr.setRequestHeader('Accept', 'application/json');
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 || fileLoaded(xhr)) {
        keycloakConfig = JSON.parse(xhr.responseText);
        callback(null);
      } else {
        callback(xhr.response);
      }
    }
  };
  xhr.send();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

function fileLoaded(xhr: any) {
  return xhr.status == 0 && xhr.responseText && xhr.responseURL.startsWith('file:');
}