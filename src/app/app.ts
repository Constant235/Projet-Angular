import {
  Component,
  OnInit,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WeatherService } from './services/weather.service';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit, OnDestroy {

  city: string = '';
  weatherList: any[] = [];
  errorMessage: string = '';

  // horloge
  currentDateTime: Date = new Date();
  private clockSub!: Subscription;

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loadSavedData();
    this.startClock();
  }

  
  /* HORLOGE */
  startClock() {
    this.clockSub = interval(1000).subscribe(() => {
      this.currentDateTime = new Date();
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy() {
    if (this.clockSub) this.clockSub.unsubscribe();
  }

  
  /* RECHERCHE */
  onSearch() {
    const cityToSearch = this.city.trim();

    if (!cityToSearch) {
      this.errorMessage = "Veuillez entrer un lieu.";
      return;
    }

    this.searchWeather(cityToSearch);
  }

  searchWeather(cityName: string) {

    this.errorMessage = '';

    this.weatherService.getWeather(cityName).subscribe({
      next: (data: any) => {

        const exists = this.weatherList.some(
          w => w.name.toLowerCase() === data.name.toLowerCase()
        );

        if (!exists) {
          this.weatherList.push(data);
          this.saveData();
        } else {
          this.errorMessage = "Lieu existant.";
        }

        this.city = '';
      },

      error: (err) => {
        if (err.status === 404) {
          this.errorMessage = "Lieu introuvable.";
        } else {
          this.errorMessage = "Erreur réseau.";
        }
      }
    });
  }

  loadSavedData() {
    if (isPlatformBrowser(this.platformId)) {
      const data = localStorage.getItem('weatherList');
      if (data) this.weatherList = JSON.parse(data);
    }
  }

  saveData() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('weatherList', JSON.stringify(this.weatherList));
    }
  }


  /* SUPPRESSION */
  removeCity(index: number) {
    this.weatherList.splice(index, 1);
    this.saveData();
  }
}
