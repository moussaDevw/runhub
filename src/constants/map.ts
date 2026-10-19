/**
 * Map Configuration & Default Location Constants
 */

export const DAKAR_COORDINATES = {
  latitude: 14.7167,
  longitude: -17.4677,
} as const;

export const DAKAR_CENTER_LNG_LAT: [number, number] = [
  DAKAR_COORDINATES.longitude,
  DAKAR_COORDINATES.latitude,
];

export const OSM_RASTER_STYLE = {
  version: 8 as const,
  sources: {
    osm: {
      type: 'raster' as const,
      tiles: [
        'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
        'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
      ],
      tileSize: 256,
      attribution: '© OpenStreetMap contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster' as const,
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
};

