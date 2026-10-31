export class PolylineService {
  /**
   * Encodes a list of coordinates into a compressed Google/Strava polyline string.
   */
  static encode(coordinates: { latitude: number; longitude: number }[]): string {
    if (!coordinates.length) return '';

    let output = '';
    let prevLat = 0;
    let prevLng = 0;

    for (const point of coordinates) {
      const lat = Math.round(point.latitude * 1e5);
      const lng = Math.round(point.longitude * 1e5);

      const dLat = lat - prevLat;
      const dLng = lng - prevLng;

      output += this.encodeSignedNumber(dLat);
      output += this.encodeSignedNumber(dLng);

      prevLat = lat;
      prevLng = lng;
    }

    return output;
  }

  /**
   * Decodes a compressed polyline string into an array of { latitude, longitude }.
   */
  static decode(encoded: string): { latitude: number; longitude: number }[] {
    const points: { latitude: number; longitude: number }[] = [];
    let index = 0;
    const len = encoded.length;
    let lat = 0;
    let lng = 0;

    while (index < len) {
      let b: number;
      let shift = 0;
      let result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = encoded.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({
        latitude: lat / 1e5,
        longitude: lng / 1e5,
      });
    }

    return points;
  }

  private static encodeSignedNumber(num: number): string {
    let sgnNum = num << 1;
    if (num < 0) {
      sgnNum = ~sgnNum;
    }
    return this.encodeNumber(sgnNum);
  }

  private static encodeNumber(num: number): string {
    let encodeString = '';
    while (num >= 0x20) {
      encodeString += String.fromCharCode((0x20 | (num & 0x1f)) + 63);
      num >>= 5;
    }
    encodeString += String.fromCharCode(num + 63);
    return encodeString;
  }
}
