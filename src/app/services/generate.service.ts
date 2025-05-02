import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
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
        return this.http.post<any>(
            `${this.apiUrl}/files/copy-folder/${folderName}`,
            {},
            { observe: 'response' }  // Important to get status code
        ).pipe(
            catchError(this.handleHttpError)
        );
    }

    getSuppressionData(sectionDetails: any, transformerName: string, config: string): Observable<any> {
        return this.http.get<any>(`assets/suppress-configurations/${config}/${transformerName}.json`).pipe(
            map(config => {
                const suppressActions: any[] = [];
                const assembliesMap = new Map<string, Set<string>>();

                if (!config) {
                    console.warn(`No configuration found for transformer: ${transformerName}`);
                    return { suppressActions }; // Return empty array
                }

                // Loop through sectionDetails and fetch suppression components
                Object.keys(sectionDetails).forEach(key => {
                    const selectedValue = sectionDetails[key];

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

    getIpartsIassembliesData(sectionDetails: any, transformerName: string, config: string): Observable<any> {
        return this.http.get<any>(`assets/ipart-iassembly-configurations/${config}/${transformerName}.json`).pipe(
            map(config => {
                const iPartsIAssemblies: any[] = [];
                const assembliesMap = new Map<string, Map<string, string>>();

                if (!config) {
                    console.warn(`No configuration found for transformer: ${transformerName}`);
                    return { iPartsIAssemblies };
                }

                // Loop through top-level config keys (e.g., "flangeType#flangeMaterial")
                for (const configKey of Object.keys(config)) {
                    const keyParts = configKey.split('#'); // e.g., ['flangeType', 'flangeMaterial']

                    // Build combined value from sectionDetails (e.g., "Type1#MS & Steel")
                    const combinedValue = keyParts.map(key => sectionDetails[key]).join('#');

                    const matchedConfig = config[configKey][combinedValue];
                    if (!matchedConfig) continue;

                    // Process assemblies
                    for (const assembly of Object.keys(matchedConfig)) {
                        if (!assembliesMap.has(assembly)) {
                            assembliesMap.set(assembly, new Map<string, string>());
                        }

                        matchedConfig[assembly].forEach((component: string) => {
                            const [instance, member] = component.split('#');
                            if (instance && member) {
                                assembliesMap.get(assembly)?.set(instance, member);
                            }
                        });
                    }
                }

                // Convert Map to array format
                assembliesMap.forEach((componentsMap, assemblyFilePath) => {
                    iPartsIAssemblies.push({
                        assemblyFilePath,
                        'iparts-iassemblies': Object.fromEntries(componentsMap)
                    });
                });

                return { iPartsIAssemblies };
            }),
            catchError(error => {
                console.error('Error fetching suppression config:', error);
                return of({ iPartsIAssemblies: [] });
            })
        );
    }

    getModelStateRepresentation(sectionDetails: any, transformerName: string): Observable<any> {
        return this.http.get<any>(`assets/model-state-configurations/${transformerName}.json`).pipe(
            map(config => {
                const tankType = sectionDetails?.tankType;
                const modelStateObj = config[tankType] || [];

                return { modelStateObj };
            }),
            catchError(error => {
                console.error('Error fetching model state config:', error);
                return of({ modelStateObj: [] });
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

    renameFolder(oldFolderName: string, newFolderName: string): Observable<any> {
        return this.http.post<any>(
            `${this.apiUrl}/files/rename-folder/${oldFolderName}/${newFolderName}`,
            {},
            { observe: 'response' }  // Important to get status code
        ).pipe(
            catchError(this.handleHttpError)
        );
    }

    private handleHttpError(error: HttpErrorResponse) {
        // Optional: log to console or remote logging
        console.error('HTTP Error:', error);

        // Rethrow the error so the subscriber can catch it
        return throwError(() => error);
    }

}