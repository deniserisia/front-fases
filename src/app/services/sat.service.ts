import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SatService {
  private apiUrl = 'http://127.0.0.1:5000/generate-sat/';
  private graphApiUrl = 'http://127.0.0.1:5000/graph-data/'; 

  constructor(private http: HttpClient) {}

  generateSatInstance(n: number, m: number, k: number): Observable<any> {
    const requestData = { n, m, k };
    console.log('📤 Enviando dados para o backend:', requestData); // Debug

    return this.http.post<any>(this.apiUrl, requestData);
  }


  getGraphData(): Observable<any> {
    console.log('📥 Buscando dados do gráfico do backend');
    return this.http.get<any>(this.graphApiUrl);
  
  }
}
