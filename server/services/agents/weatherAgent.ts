import { db } from '../../db/store';

export interface WeatherAgentResult {
  temperatureCelsius: number;
  condition: string;
  rainProbability: number;
  humidity: number;
  forecastSummary: string;
  advisory: string;
  recommendedPackList: string[];
}

export class WeatherAgent {
  name = 'Weather Agent';
  role = 'Monitor atmospheric data, forecast rain probabilities, and issue climate-adaptive packing and schedule guidance.';

  execute(destinationName: string, startDate: string): WeatherAgentResult {
    const term = (destinationName || 'Goa').toLowerCase();
    const dest = db.destinations.find((d) => d.name.toLowerCase().includes(term));

    const temp = dest ? dest.avgTemperatureCelsius : 28;
    const condition = dest ? dest.weatherCondition : 'Sunny & Pleasant';
    const rain = dest ? dest.rainProbability : 12;
    const humidity = dest ? dest.humidity : 65;

    let advisory = 'Clear weather conditions favorable for outdoor adventures and beachside exploration.';
    let packList = ['Sunscreen & Sunglasses', 'Breathable Cotton Wear', 'Hat & Light Footwear'];

    if (rain > 40) {
      advisory = 'Moderate showers predicted on afternoon intervals. Recommended prioritizing indoor cultural pavilions, historic churches, and spice plantation visits.';
      packList.push('Compact Umbrella / Rain Poncho', 'Waterproof Phone Pouch');
    } else if (temp < 20) {
      advisory = 'Crisp mountain breezes and cool evenings. Layered thermal apparel recommended for night strolls.';
      packList = ['Light Down Jacket', 'Fleece Sweater', 'Comfortable Trekking Boots'];
    }

    return {
      temperatureCelsius: temp,
      condition,
      rainProbability: rain,
      humidity,
      forecastSummary: `${condition}, ~${temp}°C with ${rain}% chance of precipitation.`,
      advisory,
      recommendedPackList: packList,
    };
  }
}
