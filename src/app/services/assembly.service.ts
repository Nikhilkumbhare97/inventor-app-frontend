import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Import of and throwError
import { catchError } from 'rxjs/operators'; // Import catchError
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AssemblyService {
    private apiUrl = `${environment.apiUrl}/inventor`;

    constructor(private http: HttpClient) { }

    openAssembly(assemblyPath: string): Observable<any> {
        const payload = { assemblyPath };
        return this.http.post<any>(`${this.apiUrl}/open-assembly`, payload).pipe(catchError(this.handleError));
    }

    changeParameters(partFilePath: string, parameters: any[]): Observable<any> {
        const body = {
            partFilePath: partFilePath,
            parameters: parameters
        };

        return this.http.post<any>(`${this.apiUrl}/change-parameters`, body)
            .pipe(
                catchError(error => {
                    return throwError(() => new Error('Failed to update parameters.'));
                })
            );
    }

    suppressComponents(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/suppress-multiple-components`, data).pipe(catchError(this.handleError));
    }

    updateModelStateandRepresenation(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/update-model-state-and-representations`, data).pipe(catchError(this.handleError));
    }

    updateIpartsIassemblies(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/update-multiple-iparts-iassemblies`, data).pipe(catchError(this.handleError));
    }

    updateIproperties(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/update-all-properties`, data).pipe(catchError(this.handleError));
    }

    updateFileNames(data: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/design-assist-rename`, data).pipe(catchError(this.handleError));
    }

    private handleError(error: any) {  // Centralized error handling

        // Return an observable with a user-facing error message
        return throwError(() => new Error('Something went wrong. Please try again later.')); // Or a more specific message
    }
}