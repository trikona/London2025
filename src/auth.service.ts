import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: false
  });

  public authState$ = this.authState.asObservable();

  constructor() {
    // Check for existing session on service initialization
    this.checkExistingSession();
  }

  private checkExistingSession(): void {
    const savedUser = localStorage.getItem('travel_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        this.authState.next({
          isAuthenticated: true,
          user,
          loading: false
        });
      } catch (error) {
        localStorage.removeItem('travel_user');
      }
    }
  }

  async signInWithGoogle(): Promise<void> {
    this.setLoading(true);
    
    // Simulate OAuth flow delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate successful Google OAuth response
    const mockUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      email: 'traveler@gmail.com',
      name: 'Travel Enthusiast',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    };

    localStorage.setItem('travel_user', JSON.stringify(mockUser));
    
    this.authState.next({
      isAuthenticated: true,
      user: mockUser,
      loading: false
    });
  }

  async signInWithGitHub(): Promise<void> {
    this.setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockUser: User = {
      id: 'github_' + Math.random().toString(36).substr(2, 9),
      email: 'developer@github.com',
      name: 'Code Traveler',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
    };

    localStorage.setItem('travel_user', JSON.stringify(mockUser));
    
    this.authState.next({
      isAuthenticated: true,
      user: mockUser,
      loading: false
    });
  }

  async signInWithEmail(email: string, password: string): Promise<void> {
    this.setLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Simple validation for demo purposes
    if (email && password.length >= 6) {
      const mockUser: User = {
        id: 'email_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'
      };

      localStorage.setItem('travel_user', JSON.stringify(mockUser));
      
      this.authState.next({
        isAuthenticated: true,
        user: mockUser,
        loading: false
      });
    } else {
      this.setLoading(false);
      throw new Error('Invalid email or password. Password must be at least 6 characters.');
    }
  }

  signOut(): void {
    localStorage.removeItem('travel_user');
    this.authState.next({
      isAuthenticated: false,
      user: null,
      loading: false
    });
  }

  private setLoading(loading: boolean): void {
    const currentState = this.authState.value;
    this.authState.next({
      ...currentState,
      loading
    });
  }

  getCurrentUser(): User | null {
    return this.authState.value.user;
  }

  isAuthenticated(): boolean {
    return this.authState.value.isAuthenticated;
  }
}