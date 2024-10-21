import { WeatherCode } from "./enums/weather-code.enum";

export interface CurrentWeather {
  temperature?: number;
  windspeed: number;
  winddirection: number;
  is_day: number;
  weathercode: string | WeatherCode;
  time: Date
}

export interface WeatherApiResponse {
  latitude: number;
  longitude: number;
  current_weather: CurrentWeather;
  utc_offset_seconds: number
}