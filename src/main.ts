import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from './auth.service';
import { LoginComponent } from './login.component';
import { provideAuth0 } from '@auth0/auth0-angular';
import { TravelOverviewComponent } from './travel-overview.component';
import travelSegmentsData from './travel-segments.json';
interface TravelSegment {
  id: number;
  type: 'train' | 'flight' | 'hotel' | 'event';
  title: string;
  description: string;
  time: string;
  location: string;
  icon: string;
  duration?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LoginComponent, TravelOverviewComponent],
  template: `
    <!-- Login Screen -->
    <app-login *ngIf="!authState.isAuthenticated"></app-login>

    <!-- Main Travel App -->
    <travel-overview  *ngIf="authState.isAuthenticated"></travel-overview>
  `
})
export class App {
  currentStep = 0;
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false
  };

  travelSegments: TravelSegment[] = travelSegmentsData as TravelSegment[]; // <-- Use imported data

  constructor(private authService: AuthService) {
    this.authService.authState$.subscribe(state => {
      this.authState = state;
    });
  }

  setActiveStep(index: number): void {
    this.currentStep = index;
  }

  getTotalSegments(): number {
    return this.travelSegments.length;
  }

  getFlightCount(): number {
    return this.travelSegments.filter(segment => segment.type === 'flight').length;
  }

  getTrainCount(): number {
    return this.travelSegments.filter(segment => segment.type === 'train').length;
  }

  signOut(): void {
    this.authService.signOut();
  }
}

bootstrapApplication(App, {
  providers: [
    provideAuth0({
      domain: 'dev-sbay6n7td66fskok.eu.auth0.com',
      clientId: 'Fg1xwuuDSGMLH5LEKGmi3C7nRSAc7AH7',
      authorizationParams: {
        redirect_uri: window.location.origin+'/travel-overview',
      }
    })
  ]
});