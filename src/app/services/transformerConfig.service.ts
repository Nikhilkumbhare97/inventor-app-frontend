import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Import of and throwError
import { catchError } from 'rxjs/operators'; // Import catchError
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class TransformerConfigService {
    private apiUrl = `${environment.apiUrl}/transformer-config`;

    constructor(private http: HttpClient) { }

    saveTransformerConfigDetails(transformerConfigDetails: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, transformerConfigDetails)
            .pipe(catchError(this.handleError)); // Handle errors
    }

    updateTransformerConfigDetails(projectUniqueId: string, transformerConfigDetails: any): Observable<any> {
        console.log('transformerDetails', transformerConfigDetails)
        return this.http.put<any>(`${this.apiUrl}/${projectUniqueId}`, transformerConfigDetails)
            .pipe(catchError(this.handleError)); // Handle errors
    }

    getTransformerConfigDetailsById(projectUniqueId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${projectUniqueId}`)
            .pipe(catchError(this.handleError)); // Handle errors
    }

    private handleError(error: any) {  // Centralized error handling
        // Return an observable with a user-facing error message
        return throwError(() => new Error('Something went wrong. Please try again later.')); // Or a more specific message
    }
}