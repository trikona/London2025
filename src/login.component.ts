import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo">✈️</div>
          <h1 class="login-title">Welcome to London Adventure</h1>
          <p class="login-subtitle">Sign in to access your travel itinerary</p>
        </div>

        <div class="login-form">
          <!-- OAuth Providers -->
          <div class="oauth-section">
            <button 
              class="oauth-button google-button"
              (click)="signInWithGoogle()"
              [disabled]="isLoading">
              <span class="oauth-icon">🔍</span>
              <span *ngIf="!isLoading">Continue with Google</span>
              <span *ngIf="isLoading && loadingProvider === 'google'" class="loading-text">
                <span class="spinner"></span>
                Connecting...
              </span>
            </button>

            <button 
              class="oauth-button github-button"
              (click)="signInWithGitHub()"
              [disabled]="isLoading">
              <span class="oauth-icon">⚡</span>
              <span *ngIf="!isLoading">Continue with GitHub</span>
              <span *ngIf="isLoading && loadingProvider === 'github'" class="loading-text">
                <span class="spinner"></span>
                Connecting...
              </span>
            </button>
          </div>

          <div class="divider">
            <span class="divider-text">or</span>
          </div>

          <!-- Email/Password Form -->
          <form (ngSubmit)="signInWithEmail()" class="email-form">
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                [(ngModel)]="email"
                name="email"
                class="form-input"
                placeholder="Enter your email"
                required>
            </div>

            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <input
                type="password"
                id="password"
                [(ngModel)]="password"
                name="password"
                class="form-input"
                placeholder="Enter your password"
                required>
            </div>

            <button 
              type="submit" 
              class="submit-button"
              [disabled]="isLoading || !email || !password">
              <span *ngIf="!isLoading || loadingProvider !== 'email'">Sign In</span>
              <span *ngIf="isLoading && loadingProvider === 'email'" class="loading-text">
                <span class="spinner"></span>
                Signing in...
              </span>
            </button>
          </form>

          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>
        </div>

        <div class="login-footer">
          <p class="demo-note">
            <strong>Demo Mode:</strong> Use any email and password (6+ characters) or try the OAuth buttons above
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .login-card {
      background: white;
      border-radius: 24px;
      padding: 48px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      width: 100%;
      max-width: 480px;
      animation: slideUp 0.6s ease-out;
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .login-header {
      text-align: center;
      margin-bottom: 40px;
    }

    .logo {
      font-size: 4rem;
      margin-bottom: 16px;
      animation: bounce 2s infinite;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% {
        transform: translateY(0);
      }
      40% {
        transform: translateY(-10px);
      }
      60% {
        transform: translateY(-5px);
      }
    }

    .login-title {
      font-size: 2rem;
      font-weight: 700;
      color: #1f2937;
      margin-bottom: 8px;
    }

    .login-subtitle {
      color: #6b7280;
      font-size: 1.1rem;
      font-weight: 400;
    }

    .oauth-section {
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-bottom: 32px;
    }

    .oauth-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 16px 24px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      background: white;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }

    .oauth-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
    }

    .oauth-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .google-button {
      border-color: #ea4335;
      color: #ea4335;
    }

    .google-button:hover:not(:disabled) {
      background: #ea4335;
      color: white;
    }

    .github-button {
      border-color: #333;
      color: #333;
    }

    .github-button:hover:not(:disabled) {
      background: #333;
      color: white;
    }

    .oauth-icon {
      font-size: 1.2rem;
    }

    .divider {
      position: relative;
      text-align: center;
      margin: 32px 0;
    }

    .divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #e5e7eb;
    }

    .divider-text {
      background: white;
      padding: 0 16px;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .email-form {
      display: flex;
      flex-direction: column;
      gap: 24px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .form-label {
      font-weight: 500;
      color: #374151;
      font-size: 0.875rem;
    }

    .form-input {
      padding: 16px;
      border: 2px solid #e5e7eb;
      border-radius: 12px;
      font-size: 1rem;
      transition: all 0.3s ease;
      background: #f9fafb;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      background: white;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .submit-button {
      padding: 16px 24px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .submit-button:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.3);
    }

    .submit-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
      transform: none;
    }

    .loading-text {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .spinner {
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      border-top: 2px solid currentColor;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    .error-message {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #dc2626;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      margin-top: 16px;
    }

    .login-footer {
      margin-top: 32px;
      text-align: center;
    }

    .demo-note {
      background: #f0f9ff;
      border: 1px solid #bae6fd;
      color: #0369a1;
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    /* Responsive Design */
    @media (max-width: 640px) {
      .login-card {
        padding: 32px 24px;
        margin: 16px;
      }

      .login-title {
        font-size: 1.5rem;
      }

      .oauth-button {
        padding: 14px 20px;
      }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';
  isLoading = false;
  loadingProvider: 'google' | 'github' | 'email' | null = null;

  constructor(private authService: AuthService) {}

  async signInWithGoogle(): Promise<void> {
    try {
      this.setLoading('google');
      this.errorMessage = '';
      await this.authService.signInWithGoogle();
    } catch (error) {
      this.errorMessage = 'Failed to sign in with Google. Please try again.';
    } finally {
      this.setLoading(null);
    }
  }

  async signInWithGitHub(): Promise<void> {
    try {
      this.setLoading('github');
      this.errorMessage = '';
      await this.authService.signInWithGitHub();
    } catch (error) {
      this.errorMessage = 'Failed to sign in with GitHub. Please try again.';
    } finally {
      this.setLoading(null);
    }
  }

  async signInWithEmail(): Promise<void> {
    try {
      this.setLoading('email');
      this.errorMessage = '';
      await this.authService.signInWithEmail(this.email, this.password);
    } catch (error) {
      this.errorMessage = error instanceof Error ? error.message : 'Failed to sign in. Please try again.';
    } finally {
      this.setLoading(null);
    }
  }

  private setLoading(provider: 'google' | 'github' | 'email' | null): void {
    this.isLoading = provider !== null;
    this.loadingProvider = provider;
  }
}