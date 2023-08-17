export interface IItems {
  id: number;
  name: string;
}

export interface IWeatherInfo {
  base: string;
  clouds: clouds;
  cod: number;
  coord: coord;
  dt: number;
  id: number;
  main: main;
  name: string;
  sys: sys;
  timezone: 10800;
  visibility: number;
  weather: weather[];
  wind: wind;
  message: string;
}
interface clouds {
  all: number;
}
interface coord {
  lon: number;
  lat: number;
}
interface main {
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity?: number;
  grnd_level: number;
  sea_level: number;
}
interface sys {
  type: number;
  id: number;
  country: string;
  sunrise: number;
  sunset: number;
}
interface weather {
  id: number;
  main: string;
  description: string;
  icon: "01d";
}
interface wind {
  deg: number;
  gust: number;
  speed: number;
}
