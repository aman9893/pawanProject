export interface MapData {
    mapData: AllMapData;
  
}
export interface AllMapData {
    carriers: any;
    cities: any;
    cityStyles: null
    countries: any;
    equipments: any;
    hubs: Object;
    labelSets: Object;
    links: null
    stations: any;
    views: Object
}
export class FlightSearch {
    id: number;
    departAirport: string;
    destinationAirport: string;
    departureDate: any;  
  }
export class TravellerDetails{
    id: number;
    passengerType: string;
    title:string;
    firstName: string;
    lastName: string;
    gender: string;
    DOB: any;
    airline: string;
    frequentFlyerNumber: string;
}
export class FrequentFlyer{
    airline: string;
    frequentFlyerNumber: string
}
  