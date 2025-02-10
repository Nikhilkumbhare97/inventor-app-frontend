import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'; // Import of and throwError
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SvgDataService {
    private apiUrl = `${environment.apiUrl}/config`;

    constructor(private http: HttpClient) { }

    getImageList(): Observable<string[]> { // Returns an Observable of string array
        return this.http.get<string[]>(`${this.apiUrl}/images`); // Adjust the endpoint as needed
    }

    getSvgData(imageName: string): Observable<any> { // Returns an Observable of any type (adjust if you have a specific interface)
        return this.http.get(`${this.apiUrl}/${imageName}`); // Adjust the endpoint as needed.  Make sure your API returns the JSON.
    }

    saveSvgData(imageName: string, svgData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${imageName}`, svgData);
    }

}
