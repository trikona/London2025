import { Injectable } from '@angular/core';
import { AuthService as Auth0Service, User as Auth0User } from '@auth0/auth0-angular';
import { Observable, combineLatest, map } from 'rxjs';

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
  public authState$: Observable<AuthState>;

  constructor(private auth0: Auth0Service) {
    this.authState$ = combineLatest([
      this.auth0.isAuthenticated$,
      this.auth0.user$,
      this.auth0.isLoading$
    ]).pipe(
      map(([isAuthenticated, auth0User, loading]) => ({
        isAuthenticated: !!isAuthenticated,
        user: auth0User ? this.mapAuth0User(auth0User) : null,
        loading: !!loading
      }))
    );
  }

  private mapAuth0User(auth0User: Auth0User): User {
    return {
      id: auth0User.sub ?? '',
      email: auth0User.email ?? '',
      name: auth0User.name ?? '',
      avatar: auth0User.picture
    };
  }

  signIn(): void {
    this.auth0.loginWithRedirect();
  }

  signOut(): void {
    this.auth0.logout({ logoutParams: { returnTo: window.location.origin } });
  }

  getCurrentUser(): Observable<User | null> {
    return this.auth0.user$.pipe(map(u => (u ? this.mapAuth0User(u) : null)));
  }

  isAuthenticated(): Observable<boolean> {
    return this.auth0.isAuthenticated$;
  }
}