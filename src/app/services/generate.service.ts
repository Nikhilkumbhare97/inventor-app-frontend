import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Import of and throwError
import { map, catchError, tap } from 'rxjs/operators'; // Import catchError
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

    getSuppressionData(tankDetails: any, transformerName: string): Observable<any> {
        return this.http.get<any>(`assets/suppress-configurations/tankConfigurations/${transformerName}.json`).pipe(
            map(config => {
                let suppressActions: any[] = [];
                let assembliesMap = new Map<string, Set<string>>();

                if (!config) {
                    console.warn(`No configuration found for transformer: ${transformerName}`);
                    return { suppressActions }; // Return empty array
                }

                // Loop through tankDetails and fetch suppression components
                Object.keys(tankDetails).forEach(key => {
                    let selectedValue = tankDetails[key];

                    if (config[key] && config[key][selectedValue]) {
                        Object.keys(config[key][selectedValue]).forEach(assembly => {
                            if (!assembliesMap.has(assembly)) {
                                assembliesMap.set(assembly, new Set<string>());
                            }
                            config[key][selectedValue][assembly]?.forEach((component: string) => {
                                assembliesMap.get(assembly)?.add(component);
                            });
                        });
                    }
                });

                // Convert Map to required API format
                assembliesMap.forEach((components, assemblyFilePath) => {
                    suppressActions.push({
                        assemblyFilePath,
                        components: Array.from(components),
                        suppress: true
                    });
                });

                return { suppressActions };
            }),
            // Handle errors gracefully
            catchError(error => {
                console.error('Error fetching suppression config:', error);
                return of({ suppressActions: [] }); // Return empty array if an error occurs
            })
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