import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatService {
  private apiUrl = 'http://127.0.0.1:5000/generate-sat/';

  constructor(private http: HttpClient) {}

  generateSatInstance(n: number, m: number, k: number): Observable<any> {
    return this.http.post<any>(this.apiUrl, { n, m, k });
  }
}
