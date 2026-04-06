import { Component, OnInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WeatherService } from './services/weather.service';
import { inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html'
})
export class App implements OnInit {

  weatherData: any;
  loading = true;
  private platformId = inject(PLATFORM_ID);

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    // ⚠️ Vérifier que nous sommes bien dans le navigateur
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('weatherData');
      if (saved) {
        this.weatherData = JSON.parse(saved);
        this.loading = false;
      }
    }

    // Appel API
    this.weatherService.getWeather('Lyon')
      .subscribe({
        next: (data) => {
          this.weatherData = data;
          this.loading = false;
          // ⚠️ sauvegarde uniquement si navigateur
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('weatherData', JSON.stringify(data));
          }
        },
        error: (err) => {
          console.error('Erreur API', err);
          this.loading = false;
        }
      });
  }
}
