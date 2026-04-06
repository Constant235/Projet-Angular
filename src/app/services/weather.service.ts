import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  
  private apiUrl = `https://api.openweathermap.org/data/2.5/weather`;

  constructor(private http: HttpClient) {}

  getWeather(city: string) {
    return this.http.get(
      `${this.apiUrl}?q=${city}&appid=${environment.openWeatherApiKey}&units=metric&lang=fr`
    );
  }
}
