import { Component, OnInit } from '@angular/core';
import { SatService } from './services/sat.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app-fases';
  n = 50;
  m = 100;
  k = 3;
  clauses: any[] = [];
  chart: any;

  constructor(private satService: SatService) {}

  ngOnInit() {
    this.createChart();
  }

  generateInstance() {
    this.satService.generateSatInstance(this.n, this.m, this.k).subscribe(response => {
      this.clauses = response.clauses;
      this.updateChart();  // Atualiza o gráfico com os dados gerados
    });
  }

  createChart() {
    this.chart = new Chart('myChart', {
      type: 'bar', // ou outro tipo de gráfico
      data: {
        labels: [], // labels serão preenchidos depois
        datasets: [{
          label: 'Cláusulas Geradas',
          data: [], // dados serão preenchidos depois
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  updateChart() {
    // Preenche os labels e dados com as cláusulas geradas
    this.chart.data.labels = this.clauses.map((_, index) => `Cláusula ${index + 1}`);
    this.chart.data.datasets[0].data = this.clauses.map(clause => clause.length); // ou qualquer métrica que você deseja
    this.chart.update(); // Atualiza o gráfico
  }
}
