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
  alpha = 0; // Razão m/n
  chart: any;
  clauses: number[][] = [];
  graphData: any[] = [];
  isLoading: boolean = false;  // Controla o estado de carregamento
  progress: number = 0;        // Progresso em %

  constructor(private satService: SatService) {}

  ngOnInit() {
    this.createChart();
    this.getGraphData();
  }

  getGraphData() {
    this.isLoading = true;  // Inicia o carregamento
    this.progress = 0;      // Zera o progresso

    this.satService.getGraphData().subscribe(
      (response) => {
        console.log('✅ Dados do gráfico recebidos:', response);
        this.createChartt(response);
        this.isLoading = false;  // Finaliza o carregamento
      },
      (error) => {
        console.error('❌ Erro ao buscar dados do gráfico:', error);
        this.isLoading = false;  // Finaliza o carregamento
      },
      () => {
        // Se você precisar atualizar o progresso durante o carregamento,
        // pode usar um setInterval ou similar para simular a atualização do progresso.
        let interval = setInterval(() => {
          if (this.progress < 100) {
            this.progress += 10;  // Simula o progresso aumentando
          } else {
            clearInterval(interval);  // Finaliza a simulação quando atingir 100%
          }
        }, 500);  // A cada 500ms
      }
    );
  }

  generateInstance() {
    this.k = Number(this.k); // Converte para número
    console.log('🔄 Chamando `generateInstance()` com valores:', { n: this.n, m: this.m, k: this.k });
  
    this.satService.generateSatInstance(this.n, this.m, this.k).subscribe(
      (response) => {
        console.log('✅ Resposta do backend:', response);
        this.alpha = response.alpha;
        this.clauses = response.clauses; // Salva as cláusulas recebidas
        this.updateChart();
      },
      (error) => {
        console.error('❌ Erro ao gerar instância:', error);
      }
    );
  }


  createChart() {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Transição de Fase SAT',
          data: this.graphData,
          backgroundColor: 'blue',
          borderColor: 'black',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Razão α = m/n'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Probabilidade de Satisfatibilidade'
            }
          }
        }
      }
    });
  }


  createChartt(data: any) {
    const ctx = document.getElementById('myChartTwo') as HTMLCanvasElement;

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data[0].alpha_values, // Eixo X (α = m/n)
        datasets: data.map((dataset: any) => ({
          label: `n=${dataset.n}`,
          data: dataset.probabilities,
          fill: false,
          borderColor: this.getRandomColor(),
          tension: 0.1
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 1,
            title: {
              display: true,
              text: 'Probabilidade de SAT'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Razão α = m/n'
            }
          }
        }
      }
    });
  }

  getRandomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;
  }

  updateChart() {
    console.log(`📊 Atualizando gráfico com novo α: ${this.alpha}`);
  
    if (this.chart) {
      this.chart.destroy(); // Remove o gráfico anterior para evitar problemas
    }
  
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
  
    this.chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Cláusulas/Variáveis'],
        datasets: [{
          label: 'Razão α = m/n',
          data: [this.alpha], // Atualiza com novo valor
          backgroundColor: 'blue',
          borderColor: 'black',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 5,
            title: {
              display: true,
              text: 'Razão α = m/n'
            }
          },
          x: {
            title: {
              display: true,
              text: 'Cláusulas/Variáveis'
            }
          }
        }
      }
    });
  }
  
}
