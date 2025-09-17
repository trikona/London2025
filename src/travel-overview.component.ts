import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService, AuthState } from './auth.service';
import { TravelService } from './travel.service';

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
  selector: 'travel-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="travel-app">
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
       .travel-app {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      font-family: 'Segoe UI', Arial, sans-serif;
      color: #22223b;
      display: flex;
      flex-direction: column;
    }

    .header {
      background: transparent;
      padding: 32px 0 16px 0;
    }

    .container {
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
      padding: 0 16px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
    }

    .header-left {
      flex: 1;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 300;
      color: #fff;
      margin-bottom: 0;
    }

    .header-right {
      display: flex;
      align-items: center;
      margin-left: 24px;
    }

    .user-profile {
      display: flex;
      align-items: center;
      background: rgba(255,255,255,0.15);
      border-radius: 16px;
      padding: 8px 16px;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
    }

    .user-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      margin-right: 12px;
      border: 2px solid #fff;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
    }

    .user-info {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }

    .user-name {
      font-weight: 600;
      color: #fff;
      margin-bottom: 4px;
      font-size: 1rem;
    }

    .sign-out-btn {
      background: linear-gradient(90deg, #3b82f6 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 16px;
      padding: 6px 18px;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
      transition: background 0.3s, box-shadow 0.3s;
    }
    .sign-out-btn:hover {
      background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
      box-shadow: 0 6px 20px rgba(59,130,246,0.18);
    }

    .main-content {
      flex: 1;
      padding: 32px 0 24px 0;
    }

    .timeline {
      display: flex;
      flex-direction: column;
      gap: 32px;
    }

    .timeline-item {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      position: relative;
      transition: background 0.2s;
    }

    .timeline-item.completed .travel-card {
      opacity: 0.7;
      background: #e0e7ff;
    }

    .timeline-item.active .travel-card {
      border: 2px solid #3b82f6;
      box-shadow: 0 4px 24px rgba(59,130,246,0.10);
      background: #fff;
    }

    .timeline-marker {
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 12px;
    }

    .icon {
      font-size: 2.2rem;
      background: #fff;
      border-radius: 50%;
      width: 56px;
      height: 56px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
      border: 2px solid #3b82f6;
    }

    .timeline-content {
      flex: 1;
    }

    .travel-card {
      background: #fff;
      border-radius: 18px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.08);
      padding: 24px 28px;
      cursor: pointer;
      transition: box-shadow 0.2s, border 0.2s, background 0.2s;
      border: 2px solid transparent;
      margin-bottom: 4px;
    }

    .travel-card:hover {
      box-shadow: 0 8px 32px rgba(59,130,246,0.18);
      border: 2px solid #764ba2;
    }

    .card-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #22223b;
      margin: 0;
    }

    .travel-type {
      font-size: 0.95rem;
      font-weight: 600;
      padding: 4px 14px;
      border-radius: 12px;
      text-transform: capitalize;
      margin-left: 12px;
      background: #e0e7ff;
      color: #3b82f6;
      letter-spacing: 1px;
    }
    .travel-type.train { background: #e0e7ff; color: #2563eb; }
    .travel-type.flight { background: #f0e7ff; color: #7c3aed; }
    .travel-type.hotel { background: #ffe7e7; color: #ef4444; }
    .travel-type.event { background: #e7fff3; color: #059669; }

    .card-body {
      margin-top: 8px;
    }

    .description {
      font-size: 1rem;
      color: #4b5563;
      margin-bottom: 12px;
    }

    .details {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
    }

    .detail-item {
      font-size: 0.97rem;
      color: #374151;
      background: #f3f4f6;
      border-radius: 8px;
      padding: 4px 12px;
      margin-bottom: 4px;
      display: flex;
      gap: 4px;
      align-items: center;
    }

    .detail-label {
      font-weight: 500;
      color: #6b7280;
      margin-right: 2px;
    }

    .detail-value {
      font-weight: 400;
      color: #22223b;
    }

    .footer {
      background: transparent;
      padding: 24px 0 16px 0;
    }

    .summary-stats {
      display: flex;
      justify-content: center;
      gap: 48px;
      flex-wrap: wrap;
    }

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      background: rgba(255,255,255,0.18);
      border-radius: 16px;
      padding: 16px 32px;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
      min-width: 120px;
    }

    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 4px;
      text-shadow: 0 2px 4px rgba(0,0,0,0.10);
    }

    .stat-label {
      font-size: 1rem;
      color: #f3f4f6;
      font-weight: 400;
      opacity: 0.9;
    }

    @media (max-width: 900px) {
      .container {
        max-width: 100%;
        padding: 0 8px;
      }
      .main-content {
        padding: 16px 0 12px 0;
      }
      .timeline {
        gap: 20px;
      }
      .travel-card {
        padding: 16px 8px;
      }
    }

    @media (max-width: 600px) {
      .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 16px;
      }
      .main-title {
        font-size: 2rem;
      }
      .stat-item {
        padding: 12px 8px;
        min-width: 90px;
      }
      .timeline-marker .icon {
        width: 40px;
        height: 40px;
        font-size: 1.3rem;
      }
    }
  
  `]
})
export class TravelOverviewComponent {
  currentStep = 0;
  authState: AuthState = {
    isAuthenticated: false,
    user: null,
    loading: false
  };

  travelSegments: TravelSegment[] = [];

  constructor(private authService: AuthService,     private travelService: TravelService) {
    this.authService.authState$.subscribe(state => {
      this.authState = state;
    });
     this.travelService.getTravelSegments().subscribe(segments => {
      this.travelSegments = segments;
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