import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from './auth.service';
import { LoginComponent } from './login.component';
import { provideAuth0 } from '@auth0/auth0-angular';
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
  imports: [CommonModule, LoginComponent],
  template: `
    <!-- Login Screen -->
    <app-login *ngIf="!authState.isAuthenticated"></app-login>

    <!-- Main Travel App -->
    <div class="travel-app" *ngIf="authState.isAuthenticated">
      <!-- Header -->
      <header class="header">
        <div class="container">
          <div class="header-content">
            <div class="header-left">
              <h1 class="main-title">✈️ London Adventure</h1>
              <p class="subtitle">Your complete travel itinerary</p>
            </div>
            <div class="header-right">
              <div class="user-profile" *ngIf="authState.user">
                <img 
                  [src]="authState.user.avatar" 
                  [alt]="authState.user.name"
                  class="user-avatar">
                <div class="user-info">
                  <span class="user-name">{{ authState.user.name }}</span>
                  <button class="sign-out-btn" (click)="signOut()">Sign Out</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Travel Timeline -->
      <main class="main-content">
        <div class="container">
          <div class="timeline">
            <div 
              *ngFor="let segment of travelSegments; let i = index" 
              class="timeline-item"
              [class.completed]="i < currentStep"
              [class.active]="i === currentStep">
              
              <div class="timeline-marker">
                <span class="icon">{{ segment.icon }}</span>
              </div>
              
              <div class="timeline-content">
                <div class="travel-card" (click)="setActiveStep(i)">
                  <div class="card-header">
                    <h3 class="card-title">{{ segment.title }}</h3>
                    <span class="travel-type" [class]="segment.type">{{ segment.type | titlecase }}</span>
                  </div>
                  
                  <div class="card-body">
                    <p class="description">{{ segment.description }}</p>
                    <div class="details">
                      <div class="detail-item">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">{{ segment.time }}</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">Location:</span>
                        <span class="detail-value">{{ segment.location }}</span>
                      </div>
                      <div class="detail-item" *ngIf="segment.duration">
                        <span class="detail-label">Duration:</span>
                        <span class="detail-value">{{ segment.duration }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Summary Footer -->
      <footer class="footer">
        <div class="container">
          <div class="summary-stats">
            <div class="stat-item">
              <span class="stat-number">{{ getTotalSegments() }}</span>
              <span class="stat-label">Travel Segments</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getFlightCount() }}</span>
              <span class="stat-label">Flights</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ getTrainCount() }}</span>
              <span class="stat-label">Train Journeys</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    .travel-app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 24px;
    }

    /* Header Styles */
    .header {
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      padding: 32px 0;
      color: white;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 24px;
    }

    .header-left {
      text-align: left;
    }

    .main-title {
      font-size: 3rem;
      font-weight: 700;
      margin-bottom: 8px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
      font-weight: 300;
    }

    .header-right {
      display: flex;
      align-items: center;
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 16px;
      background: rgba(255, 255, 255, 0.1);
      padding: 12px 20px;
      border-radius: 50px;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid rgba(255, 255, 255, 0.3);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .user-name {
      font-weight: 600;
      font-size: 0.875rem;
      color: white;
    }

    .sign-out-btn {
      background: none;
      border: 1px solid rgba(255, 255, 255, 0.3);
      color: rgba(255, 255, 255, 0.8);
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .sign-out-btn:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border-color: rgba(255, 255, 255, 0.5);
    }

    /* Main Content */
    .main-content {
      padding: 48px 0;
    }

    /* Timeline Styles */
    .timeline {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
    }

    .timeline::before {
      content: '';
      position: absolute;
      left: 32px;
      top: 0;
      bottom: 0;
      width: 3px;
      background: linear-gradient(to bottom, #3b82f6, #10b981);
      border-radius: 2px;
    }

    .timeline-item {
      position: relative;
      margin-bottom: 40px;
      padding-left: 80px;
      transition: all 0.3s ease;
    }

    .timeline-marker {
      position: absolute;
      left: 0;
      top: 8px;
      width: 64px;
      height: 64px;
      background: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 2;
      transition: all 0.3s ease;
    }

    .timeline-item.active .timeline-marker {
      transform: scale(1.1);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
      background: #3b82f6;
    }

    .timeline-item.active .icon {
      color: white;
    }

    .timeline-item.completed .timeline-marker {
      background: #10b981;
    }

    .timeline-item.completed .icon {
      color: white;
    }

    .icon {
      font-size: 1.5rem;
      transition: color 0.3s ease;
    }

    /* Travel Card Styles */
    .travel-card {
      background: white;
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .travel-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
    }

    .timeline-item.active .travel-card {
      border: 2px solid #3b82f6;
      box-shadow: 0 8px 30px rgba(59, 130, 246, 0.2);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }

    .card-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
    }

    .travel-type {
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .travel-type.train {
      background: #dbeafe;
      color: #1d4ed8;
    }

    .travel-type.flight {
      background: #f3e8ff;
      color: #7c3aed;
    }

    .travel-type.hotel {
      background: #d1fae5;
      color: #065f46;
    }

    .travel-type.event {
      background: #fed7d7;
      color: #c53030;
    }

    .description {
      color: #6b7280;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 16px;
    }

    .details {
      display: grid;
      gap: 8px;
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .detail-label {
      font-weight: 500;
      color: #374151;
    }

    .detail-value {
      color: #6b7280;
      font-weight: 400;
    }

    /* Footer Styles */
    .footer {
      background: rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(10px);
      padding: 32px 0;
      margin-top: 48px;
    }

    .summary-stats {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 32px;
      text-align: center;
    }

    .stat-item {
      color: white;
    }

    .stat-number {
      display: block;
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
    }

    .stat-label {
      font-size: 1rem;
      opacity: 0.9;
      font-weight: 300;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .header-content {
        flex-direction: column;
        text-align: center;
      }

      .header-left {
        text-align: center;
      }

      .main-title {
        font-size: 2rem;
      }

      .container {
        padding: 0 16px;
      }

      .timeline-item {
        padding-left: 64px;
      }

      .timeline::before {
        left: 24px;
      }

      .timeline-marker {
        left: -8px;
        width: 48px;
        height: 48px;
      }

      .card-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .summary-stats {
        grid-template-columns: 1fr;
        gap: 24px;
      }
    }
  `]
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
        redirect_uri: window.location.origin
      }
    })
  ]
});