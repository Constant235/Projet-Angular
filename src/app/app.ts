import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class App implements OnInit {

  weatherData: any;
  loading = true;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // Charger les données sauvegardées si existantes
    const saved = localStorage.getItem('weatherData');
    if (saved) {
      this.weatherData = JSON.parse(saved);
      this.loading = false;
    }

    // Appel API pour récupérer la météo actuelle
    this.weatherService.getWeather("Lyon")
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.loading = false;
          // Sauvegarde locale pour garder les données après refresh
          localStorage.setItem('weatherData', JSON.stringify(data));
        },
        error: (err) => {
          console.error('Erreur API', err);
          this.loading = false;
        }
      });
  }
}
