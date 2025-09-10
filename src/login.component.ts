import { Component } from '@angular/core';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login-bg">
      <div class="login-container">
        <img src="https://i.ibb.co/CKmdzp4S/logo-search-grid-1x.png" alt="Logo" class="main-logo" />
        <h1 class="main-title">Trixis traumhafte Travel Tours</h1>
        <p class="subtitle">presenting</p>
        <div class="login-card">
          <h2 class="login-title">Herbst in London 2025</h2>      
          <button (click)="login()" class="login-btn">Klick hier für deinen Reiseplan</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-bg {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-container {
      width: 100%;
      max-width: 420px;
      margin: 0 auto;
      padding: 32px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .main-logo {
      width: 90px;
      height: 90px;
      object-fit: contain;
      margin-bottom: 18px;
      border-radius: 16px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.10);
      background: #f2f8f9;
      padding: 8px;
    }

    .main-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 8px;
      color: #fff;
      text-shadow: 0 2px 4px rgba(0,0,0,0.1);
      text-align: center;
    }

    .subtitle {
      font-size: 1.1rem;
      opacity: 0.9;
      font-weight: 300;
      color: #fff;
      margin-bottom: 32px;
      text-align: center;
    }

    .login-card {
      background: white;
      border-radius: 20px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.10);
      padding: 32px 24px 28px 24px;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .login-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 8px;
      text-align: center;
    }

    .login-subtitle {
      font-size: 1rem;
      color: #6b7280;
      margin-bottom: 24px;
      text-align: center;
    }

    .login-btn {
      background: linear-gradient(90deg, #3b82f6 0%, #764ba2 100%);
      color: #fff;
      border: none;
      border-radius: 24px;
      padding: 12px 32px;
      font-size: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(59,130,246,0.10);
      transition: background 0.3s, box-shadow 0.3s;
      margin-top: 8px;
    }

    .login-btn:hover {
      background: linear-gradient(90deg, #2563eb 0%, #7c3aed 100%);
      box-shadow: 0 6px 20px rgba(59,130,246,0.18);
    }

    @media (max-width: 600px) {
      .login-container {
        padding: 16px 0;
      }
      .login-card {
        padding: 24px 8px 20px 8px;
      }
      .main-title {
        font-size: 2rem;
      }
      .main-logo {
        width: 64px;
        height: 64px;
        margin-bottom: 12px;
      }
    }
  `]
})
export class LoginComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.signIn();
  }
}