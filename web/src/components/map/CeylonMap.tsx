'use client';

import React, { useEffect, useRef } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Place, VisitSequenceResult } from '@/types';

interface CeylonMapProps {
  center: [number, number]; // [lng, lat]
  radiusKm: number;
  places: Place[];
  selectedPlace: Place | null;
  onSelectPlace: (place: Place) => void;
  sequenceResult?: VisitSequenceResult | null;
  onMapClick?: (coords: [number, number]) => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  heritage: '#d97706', // Amber-600
  nature: '#059669', // Emerald-600
  tea_agriculture: '#15803d', // Green-700
  wildlife: '#0284c7', // Sky-600
  food_local: '#ea580c', // Orange-600
  coastal: '#0891b2', // Cyan-600
};

export default function CeylonMap({
  center,
  radiusKm,
  places,
  selectedPlace,
  onSelectPlace,
  sequenceResult,
  onMapClick,
}: CeylonMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    if (map.current) return;

    const m = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: [
              'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
              'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            ],
            tileSize: 256,
            attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
          },
        },
        layers: [
          {
            id: 'osm-tiles',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: center,
      zoom: radiusKm >= 120 ? 7.2 : 11.5,
    });

    m.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    m.on('click', (e) => {
      if (onMapClick) {
        onMapClick([e.lngLat.lng, e.lngLat.lat]);
      }
    });

    map.current = m;

    return () => {
      m.remove();
      map.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [centerLng, centerLat] = center;

  // Update map center when props change (unless viewing full sequence route)
  useEffect(() => {
    if (!map.current || sequenceResult) return;
    const targetZoom = radiusKm >= 120 ? 7.2 : radiusKm > 40 ? 9.0 : radiusKm > 15 ? 11.0 : 12.5;
    map.current.flyTo({
      center: [centerLng, centerLat],
      essential: true,
      zoom: targetZoom,
      speed: 1.2,
    });
  }, [centerLng, centerLat, radiusKm, sequenceResult]);

  // Route Polyline Layer for Sequencer
  useEffect(() => {
    const m = map.current;
    if (!m) return;

    const updateRouteLayer = () => {
      if (m.getSource('sequence-route')) {
        if (m.getLayer('sequence-route-line-bg')) m.removeLayer('sequence-route-line-bg');
        if (m.getLayer('sequence-route-line')) m.removeLayer('sequence-route-line');
        m.removeSource('sequence-route');
      }

      if (!sequenceResult || sequenceResult.route_geometry.length < 2) return;

      const geojson: GeoJSON.Feature<GeoJSON.LineString> = {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: sequenceResult.route_geometry,
        },
      };

      m.addSource('sequence-route', {
        type: 'geojson',
        data: geojson,
      });

      // Background border
      m.addLayer({
        id: 'sequence-route-line-bg',
        type: 'line',
        source: 'sequence-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#064e3b',
          'line-width': 7,
          'line-opacity': 0.7,
        },
      });

      // Vibrant foreground line
      m.addLayer({
        id: 'sequence-route-line',
        type: 'line',
        source: 'sequence-route',
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
        },
        paint: {
          'line-color': '#10b981',
          'line-width': 4,
          'line-dasharray': [2, 2],
        },
      });

      // Fit bounds to show entire sequence
      const bounds = new maplibregl.LngLatBounds();
      sequenceResult.route_geometry.forEach((coord) => {
        bounds.extend(coord as [number, number]);
      });
      m.fitBounds(bounds, { padding: 80, maxZoom: 14 });
    };

    if (m.isStyleLoaded()) {
      updateRouteLayer();
    } else {
      m.once('load', updateRouteLayer);
    }
  }, [sequenceResult]);

  // Update markers
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // If sequence is active, render numbered sequence pins!
    if (sequenceResult && sequenceResult.stops.length > 0) {
      // 1. Origin flag pin
      const originEl = document.createElement('div');
      originEl.className = 'cursor-pointer transform hover:scale-125 transition-transform z-30';
      originEl.innerHTML = `
        <div class="px-2.5 py-1 rounded-full bg-emerald-800 text-white text-xs font-bold shadow-lg border-2 border-white flex items-center gap-1">
          <span>🚩</span>
          <span class="max-w-[100px] truncate">Start</span>
        </div>
      `;
      const originMarker = new maplibregl.Marker({ element: originEl })
        .setLngLat([sequenceResult.start_location.longitude, sequenceResult.start_location.latitude])
        .addTo(map.current);
      markersRef.current.push(originMarker);

      // 2. Sequential numbered pins
      sequenceResult.stops.forEach((stop) => {
        const stopEl = document.createElement('div');
        stopEl.className = 'cursor-pointer transform hover:scale-125 transition-transform z-30';
        stopEl.innerHTML = `
          <div class="px-2.5 py-1 rounded-full bg-emerald-700 text-white text-xs font-black shadow-xl border-2 border-white flex items-center gap-1.5 ring-2 ring-emerald-400/40">
            <span class="w-4 h-4 rounded-full bg-white text-emerald-800 text-[10px] font-black flex items-center justify-center">${stop.stop_number}</span>
            <span class="max-w-[110px] truncate font-bold">${stop.name.split(' ')[0]}</span>
          </div>
        `;

        stopEl.addEventListener('click', () => {
          const match = places.find((p) => p.id === stop.place_id);
          if (match) onSelectPlace(match);
        });

        const stopMarker = new maplibregl.Marker({ element: stopEl })
          .setLngLat([stop.longitude, stop.latitude])
          .addTo(map.current!);
        markersRef.current.push(stopMarker);
      });
      return;
    }

    // Default markers view when no sequence is active:
    // Add user/search center pin
    const centerEl = document.createElement('div');
    centerEl.className = 'w-6 h-6 rounded-full bg-emerald-700 border-2 border-white shadow-lg ring-4 ring-emerald-400/40 animate-pulse flex items-center justify-center';
    centerEl.innerHTML = '<div class="w-2 h-2 rounded-full bg-white"></div>';
    const centerMarker = new maplibregl.Marker({ element: centerEl })
      .setLngLat(center)
      .addTo(map.current);
    markersRef.current.push(centerMarker);

    // Add place pins
    places.forEach((place) => {
      const isSelected = selectedPlace?.id === place.id;
      const color = CATEGORY_COLORS[place.category] || '#047857';

      const el = document.createElement('div');
      el.className = `cursor-pointer transition-transform transform ${
        isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
      }`;
      el.innerHTML = `
        <div style="background-color: ${color};" class="relative px-2.5 py-1 rounded-full text-white text-xs font-semibold shadow-md flex items-center gap-1 border border-white">
          <span>${place.category === 'heritage' ? '🏛️' : place.category === 'nature' ? '🌿' : place.category === 'tea_agriculture' ? '🍃' : place.category === 'coastal' ? '🏖️' : place.category === 'wildlife' ? '🐘' : '📍'}</span>
          <span class="max-w-[110px] truncate">${place.name.split(' ')[0]}</span>
          ${place.is_switchback_corridor ? '<span title="Mountain corridor switchback">⛰️</span>' : ''}
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectPlace(place);
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places, selectedPlace, center, sequenceResult]);

  return (
    <div className="relative w-full h-full min-h-[400px]">
      <div ref={mapContainer} className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden shadow-inner" />
      
      {/* Topography indicator overlay */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-gray-100 flex items-center gap-2 text-xs font-medium text-gray-700">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
        <span>
          {sequenceResult 
            ? `Active Sequence: ${sequenceResult.total_stops} corridor stops connected`
            : 'Topography Engine: Travel times adjusted for switchbacks'}
        </span>
      </div>
    </div>
  );
}
