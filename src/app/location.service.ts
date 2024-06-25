import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  // Haversine formula to calculate distance between two points
  getDistanceFromLatLonInMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Radius of the Earth in meters
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in meters
    return distance;
  }

  // Convert degrees to radians
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  // Check if a point is within a certain radius from another point
  isWithinRadius(lat1: number, lon1: number, lat2: number, lon2: number, radius: number): boolean {
    const distance = this.getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2);
    console.log("found distance: ",distance);
    
    return distance <= radius;
  }

}
