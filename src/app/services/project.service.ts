import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Import of and throwError
import { catchError } from 'rxjs/operators'; // Import catchError
import { environment } from '../../environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) { }

  createProject(projectData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, projectData)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  updateProject(projectUniqueId: string, projectData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${projectUniqueId}`, projectData)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  getProjectById(projectUniqueId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${projectUniqueId}`)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  getAllProjects(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  deleteProject(projectUniqueId: string | null | undefined): Observable<void> {  // Accept null or undefined
    if (!projectUniqueId) {
      return of(undefined); // Return an empty observable if ID is missing (no-op)
      // or return throwError(() => new Error('Project ID is missing')); // If you want to throw error
    }
    return this.http.delete<void>(`${this.apiUrl}/${projectUniqueId}`)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  checkProjectNumberExists(projectNumber: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/exists/${projectNumber}`)
      .pipe(catchError(this.handleError)); // Handle errors
  }

  getProjectsByStatus(status: string[]): Observable<Project[]> {
    const params = new HttpParams().set('status', status.join(','));
    return this.http.get<Project[]>(`${this.apiUrl}/status`, { params })
      .pipe(catchError(this.handleError)); // Handle errors
  }

  getPagedProjects(
    page: number,
    pageSize: number,
    search: string,
    sortBy: string,
    sortDirection: string,
    status: string[]
  ): Observable<{ projects: Project[], totalCount: number }> {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize)
      .set('search', search)
      .set('sortBy', sortBy)
      .set('sortDirection', sortDirection);
    status.forEach(s => params = params.append('status', s));
    return this.http.get<{ projects: Project[], totalCount: number }>(`${this.apiUrl}/paged`, { params });
  }

  private handleError(error: any) {  // Centralized error handling

    // Return an observable with a user-facing error message
    return throwError(() => new Error('Something went wrong. Please try again later.')); // Or a more specific message
  }
}