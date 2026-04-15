import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})

export class App implements OnInit {

  city: string = '';
  weatherList: any[] = [];
  loading: boolean = false;

  constructor(
    private weatherService: WeatherService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {

    // Charger les données sauvegardées
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('weatherList');
      if (saved) {
        this.weatherList = JSON.parse(saved);
      }
    }

    // Ville par défaut
    this.searchWeather('');
  }

  searchWeather(cityName?: string) {

    const cityToSearch = (cityName || this.city).trim();

    if (!cityToSearch) return;

    this.loading = true;

    this.weatherService.getWeather(cityToSearch)
      .subscribe({
        next: (data: any) => {

          // éviter doublons
          const exists = this.weatherList.some(
            w => w.name.toLowerCase() === data.name.toLowerCase()
          );

          if (!exists) {
            this.weatherList.push(data);
          }

          this.city = '';
          this.loading = false;

          // sauvegarde localStorage
          if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem(
              'weatherList',
              JSON.stringify(this.weatherList)
            );
          }
        },

        error: (err) => {
          console.error('Erreur API météo :', err);
          this.loading = false;
        }
      });
  }

  removeCity(index: number) {
    this.weatherList.splice(index, 1);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'weatherList',
        JSON.stringify(this.weatherList)
      );
    }
  }
}
