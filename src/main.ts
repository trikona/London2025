import { Component, inject } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, RouterOutlet, Routes, CanActivateFn, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { provideAuth0, AuthService as Auth0Service } from '@auth0/auth0-angular';
import { LoginComponent } from './login.component';
import { TravelOverviewComponent } from './travel-overview.component';
import { map } from 'rxjs/operators';
import { AuthService, AuthState } from './auth.service';
import { provideHttpClient } from '@angular/common/http';
// Auth Guard: Only allow navigation if authenticated, otherwise redirect to login
const authGuard: CanActivateFn = () => {
  const auth = inject(Auth0Service);
  return auth.isAuthenticated$.pipe(
    // If not authenticated, trigger login and block navigation
    // If authenticated, allow navigation
    // Auth0 will handle redirect automatically
    // If you want to redirect to login route, you can do so here
    // But with Auth0, just call loginWithRedirect
    // and return false to block navigation
    // Otherwise, return true
    // This will work for observable-based guards in Angular 15+
    // (If using older Angular, use a class-based guard)
    // Here, we use tap to trigger login if not authenticated
    // and map to true/false for navigation

    map(isAuth => {
      if (!isAuth) {
        auth.loginWithRedirect();
        return false;
      }
      return true;
    })
  );
};



const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'travel-overview',
    component: TravelOverviewComponent,
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
   <router-outlet></router-outlet>`

})
export class App {
  currentStep = 0;
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false
  };


  constructor(private authService: AuthService, private router: Router) {
    this.authService.authState$.subscribe(state => {
      this.authState = state;
      // Redirect to /travel-overview if authenticated and not already there
      if (state.isAuthenticated && this.router.url !== '/travel-overview') {
        this.router.navigate(['/travel-overview']);
      }

    });
  }

  signOut(): void {
    this.authService.signOut();
  }
}

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAuth0({
      domain: 'login.andrea-kittner.eu',
      clientId: 'Fg1xwuuDSGMLH5LEKGmi3C7nRSAc7AH7',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'andrea-kittner.eu/api'
      }
    })
  ]
});