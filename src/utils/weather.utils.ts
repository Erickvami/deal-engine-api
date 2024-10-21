import { WeatherCode } from "../models/enums/weather-code.enum";

export function getWeatherDescription(code: number): string {
    switch (code) {
        case WeatherCode.ClearSky:
            return "Clear sky";
        case WeatherCode.MainlyClear:
            return "Mainly clear";
        case WeatherCode.PartlyCloudy:
            return "Partly cloudy";
        case WeatherCode.Overcast:
            return "Overcast";
        case WeatherCode.Fog:
            return "Fog";
        case WeatherCode.DepositingRimeFog:
            return "Depositing rime fog";
        case WeatherCode.DrizzleLight:
            return "Drizzle: Light intensity";
        case WeatherCode.DrizzleModerate:
            return "Drizzle: Moderate intensity";
        case WeatherCode.DrizzleDense:
            return "Drizzle: Dense intensity";
        case WeatherCode.FreezingDrizzleLight:
            return "Freezing drizzle: Light intensity";
        case WeatherCode.FreezingDrizzleDense:
            return "Freezing drizzle: Dense intensity";
        case WeatherCode.RainSlight:
            return "Rain: Slight intensity";
        case WeatherCode.RainModerate:
            return "Rain: Moderate intensity";
        case WeatherCode.RainHeavy:
            return "Rain: Heavy intensity";
        case WeatherCode.FreezingRainLight:
            return "Freezing rain: Light intensity";
        case WeatherCode.FreezingRainHeavy:
            return "Freezing rain: Heavy intensity";
        case WeatherCode.SnowFallSlight:
            return "Snow fall: Slight intensity";
        case WeatherCode.SnowFallModerate:
            return "Snow fall: Moderate intensity";
        case WeatherCode.SnowFallHeavy:
            return "Snow fall: Heavy intensity";
        case WeatherCode.SnowGrains:
            return "Snow grains";
        case WeatherCode.RainShowersSlight:
            return "Rain showers: Slight intensity";
        case WeatherCode.RainShowersModerate:
            return "Rain showers: Moderate intensity";
        case WeatherCode.RainShowersViolent:
            return "Rain showers: Violent intensity";
        case WeatherCode.SnowShowersSlight:
            return "Snow showers: Slight intensity";
        case WeatherCode.SnowShowersHeavy:
            return "Snow showers: Heavy intensity";
        case WeatherCode.ThunderstormSlight:
        case WeatherCode.ThunderstormModerate:
            return "Thunderstorm: Slight or moderate intensity";
        case WeatherCode.ThunderstormWithSlightHail:
            return "Thunderstorm with slight hail";
        case WeatherCode.ThunderstormWithHeavyHail:
            return "Thunderstorm with heavy hail";
        default:
            return "Unknown weather code";
    }
}