import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatService {
  private apiUrl = 'https://api-fases.vercel.app/generate-sat/';
  private graphApiUrl = 'https://api-fases.vercel.app/graph-data/'; 

  constructor(private http: HttpClient) {}

  generateSatInstance(n: number, m: number, k: number): Observable<any> {
    const requestData = { n, m, k };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('📤 Enviando dados para o backend:', requestData); // Debug
    return this.http.post<any>(this.apiUrl, requestData, { headers });
  }
  
  getGraphData(): Observable<any> {
    console.log('📥 Buscando dados do gráfico do backend');
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<any>(this.graphApiUrl, { headers });
  }
}
