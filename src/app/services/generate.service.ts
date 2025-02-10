import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Import of and throwError
import { catchError, tap } from 'rxjs/operators'; // Import catchError
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GenerateService {
    private apiUrl = `${environment.apiUrl}`;

    constructor(private http: HttpClient) { }

    createFolder(folderName: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/files/copy-folder/${folderName}`, {}) // Send empty body
            .pipe(
                tap((response: any) => console.log('API Response:', response)), // Log successful responses
                catchError(this.handleError)
            );
    }


    private handleError(error: any) {
        console.error('API error occurred:', error);

        if (error.error instanceof ErrorEvent) {
            // Client-side error
            return throwError(() => new Error(`Client-side error: ${error.error.message}`));
        } else {
            // Server-side error
            return throwError(() => new Error(error.error?.message || 'Something went wrong. Please try again later.'));
        }
    }
}