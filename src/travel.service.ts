import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TravelService {
    private apiUrl = '/api/api.php';

    constructor(private http: HttpClient, private auth: AuthService) {}

    getTravelSegments(): Observable<any> {
        return from(this.auth.getAccessTokenSilently()).pipe(
            switchMap(token => {
                const headers = new HttpHeaders({
                    Authorization: `Bearer ${token}`
                });
                return this.http.get<any>(this.apiUrl, { headers });
            })
        );
    }
}