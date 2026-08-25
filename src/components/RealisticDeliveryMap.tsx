import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import {
  Navigation,
  Compass,
  Layers,
  CloudRain,
  Sun,
  CloudLightning,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  MapPin,
  Clock,
  Gauge,
  Activity,
  CheckCircle2,
  Car,
  Maximize2,
  Crosshair
} from 'lucide-react';
import { RouteOption, TrafficLevel } from '../types';

interface RealisticDeliveryMapProps {
  className?: string;
  heightClass?: string;
}

// Hyderabad Geographic Coordinates
const HYDERABAD_CENTER: [number, number] = [17.4420, 78.3710];
const RESTAURANT_COORD: [number, number] = [17.4483, 78.3915]; // Madhapur Main Road
const CUSTOMER_COORD: [number, number] = [17.4320, 78.3490]; // Gachibowli Financial District

// Landmark Waypoints
const LANDMARKS = [
  { name: 'Madhapur Metro', coords: [17.4498, 78.3930], type: 'metro' },
  { name: 'HITEC Cyber Towers', coords: [17.4504, 78.3808], type: 'landmark' },
  { name: 'Inorbit Mall / Durgam Cheruvu', coords: [17.4390, 78.3850], type: 'landmark' },
  { name: 'Kondapur Junction', coords: [17.4640, 78.3680], type: 'junction' },
  { name: 'Knowledge City / T-Hub', coords: [17.4350, 78.3690], type: 'tech' },
  { name: 'Bio-Diversity Junction', coords: [17.4410, 78.3650], type: 'junction' },
  { name: 'Gachibowli Flyover', coords: [17.4360, 78.3540], type: 'flyover' }
];

export const RealisticDeliveryMap: React.FC<RealisticDeliveryMapProps> = ({
  className = '',
  heightClass = 'h-[540px] sm:h-[620px]'
}) => {
  const {
    tracking,
    conditions,
    prediction,
    selectRoute,
    updateConditions
  } = useApp();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const restaurantMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const landmarkMarkersRef = useRef<L.Marker[]>([]);
  const incidentMarkersRef = useRef<L.Marker[]>([]);
  const activeRoutePolylineRef = useRef<L.Polyline | null>(null);
  const altRoutePolylinesRef = useRef<L.Polyline[]>([]);
  const trafficSegmentPolylinesRef = useRef<L.Polyline[]>([]);

  // Map Interactive State
  const [autoFollow, setAutoFollow] = useState<boolean>(true);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showWeatherOverlay, setShowWeatherOverlay] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(false);
  const [showEvents, setShowEvents] = useState<boolean>(true);
  const [activeTabRoute, setActiveTabRoute] = useState<string>('ROUTE_C');

  // Derive active route from prediction or tracking
  const activeRoute = useMemo(() => {
    return (
      prediction?.availableRoutes.find(r => r.id === (tracking?.currentRouteId || activeTabRoute)) ||
      prediction?.recommendedRoute ||
      prediction?.availableRoutes[0]
    );
  }, [prediction, tracking?.currentRouteId, activeTabRoute]);

  const progress = tracking?.driverPosition?.progress ?? 32;
  const currentSpeed = tracking?.speedKmh ?? 28;
  const remainingDist = tracking?.distanceRemainingKm ?? 2.8;
  const eta = tracking?.etaMinutes ?? 18;
  const riskScore = tracking?.riskScore ?? prediction?.riskScore ?? 18;
  const deliveryHealth = tracking?.deliveryHealth ?? prediction?.deliveryHealthScore ?? 88;

  // Calculate Courier Latitude/Longitude & Bearing Angle along route
  const currentCourierGeo = useMemo(() => {
    const coords = activeRoute?.geoCoordinates || [
      RESTAURANT_COORD,
      [17.4504, 78.3808],
      [17.4410, 78.3650],
      [17.4360, 78.3540],
      CUSTOMER_COORD
    ];

    if (coords.length < 2) {
      return { lat: coords[0][0], lng: coords[0][1], bearing: 0 };
    }

    // Compute segment lengths
    const segmentLengths: number[] = [];
    let totalLength = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const d = Math.hypot(p2[0] - p1[0], p2[1] - p1[1]);
      segmentLengths.push(d);
      totalLength += d;
    }

    const targetDist = (progress / 100) * totalLength;
    let accumulated = 0;

    for (let i = 0; i < segmentLengths.length; i++) {
      const segLen = segmentLengths[i];
      if (accumulated + segLen >= targetDist || i === segmentLengths.length - 1) {
        const segProgress = segLen > 0 ? (targetDist - accumulated) / segLen : 0;
        const clampedProg = Math.max(0, Math.min(1, segProgress));
        const p1 = coords[i];
        const p2 = coords[i + 1];
        const lat = p1[0] + (p2[0] - p1[0]) * clampedProg;
        const lng = p1[1] + (p2[1] - p1[1]) * clampedProg;

        // Calculate heading in degrees
        const dLat = p2[0] - p1[0];
        const dLng = p2[1] - p1[1];
        let angleDeg = (Math.atan2(dLng, dLat) * 180) / Math.PI;
        if (angleDeg < 0) angleDeg += 360;

        return { lat, lng, bearing: Math.round(angleDeg) };
      }
      accumulated += segLen;
    }

    const last = coords[coords.length - 1];
    return { lat: last[0], lng: last[1], bearing: 0 };
  }, [activeRoute, progress]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: HYDERABAD_CENTER,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
      maxZoom: 18,
      minZoom: 12
    });

    // Clean, high-resolution CartoDB Voyager Tile Layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // Custom Zoom Controls
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;

    // Pan / Drag listener to disable autoFollow if user manually explores
    map.on('dragstart', () => {
      setAutoFollow(false);
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers (Restaurant, Customer, Landmarks, Incidents)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Restaurant Marker (Spice Route Kitchen, Madhapur)
    if (!restaurantMarkerRef.current) {
      const restIcon = L.divIcon({
        className: 'custom-rest-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
              <span style="font-size: 16px;">🍽</span>
            </div>
            <div class="mt-1 whitespace-nowrap rounded-md bg-slate-900/90 px-2 py-0.5 text-[10px] font-black text-white shadow-md border border-slate-700">
              Spice Route Kitchen
            </div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 20]
      });

      const marker = L.marker(RESTAURANT_COORD, { icon: restIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 space-y-1">
            <h4 class="font-bold text-xs text-slate-900">Spice Route Kitchen (Origin)</h4>
            <p class="text-[11px] text-slate-600">Madhapur Main Road, HITEC City</p>
            <span class="inline-block rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-800 border border-amber-200">
              Kitchen Status: ${conditions.storeStatus}
            </span>
          </div>
        `);
      restaurantMarkerRef.current = marker;
    }

    // 2. Customer Marker (Gachibowli Drop)
    if (!customerMarkerRef.current) {
      const custIcon = L.divIcon({
        className: 'custom-cust-marker',
        html: `
          <div class="relative flex flex-col items-center">
            <div class="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg border-2 border-white transform hover:scale-110 transition-transform">
              <span style="font-size: 16px;">🏠</span>
            </div>
            <div class="mt-1 whitespace-nowrap rounded-md bg-emerald-950 px-2 py-0.5 text-[10px] font-black text-white shadow-md border border-emerald-800">
              Your Drop Location
            </div>
          </div>
        `,
        iconSize: [120, 50],
        iconAnchor: [60, 20]
      });

      const marker = L.marker(CUSTOMER_COORD, { icon: custIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 space-y-1">
            <h4 class="font-bold text-xs text-slate-900">Your Location (Destination)</h4>
            <p class="text-[11px] text-slate-600">Financial District, Gachibowli, Hyderabad</p>
            <span class="inline-block rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
              Ready for Handover
            </span>
          </div>
        `);
      customerMarkerRef.current = marker;
    }

    // 3. Landmarks
    landmarkMarkersRef.current.forEach(m => m.remove());
    landmarkMarkersRef.current = [];

    LANDMARKS.forEach(lm => {
      const icon = L.divIcon({
        className: 'custom-landmark-marker',
        html: `
          <div class="flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-bold text-slate-700 shadow-xs border border-slate-200/90 whitespace-nowrap">
            <span class="h-1.5 w-1.5 rounded-full bg-cyan-600"></span>
            <span>${lm.name}</span>
          </div>
        `,
        iconSize: [100, 20],
        iconAnchor: [50, 10]
      });

      const mark = L.marker(lm.coords as [number, number], { icon }).addTo(map);
      landmarkMarkersRef.current.push(mark);
    });

    // 4. Traffic Incident Blockage Marker
    incidentMarkersRef.current.forEach(m => m.remove());
    incidentMarkersRef.current = [];

    if (conditions.trafficLevel === 'SEVERE' || conditions.trafficLevel === 'HIGH' || conditions.roadCondition === 'BLOCKED') {
      const incidentIcon = L.divIcon({
        className: 'custom-incident-marker',
        html: `
          <div class="relative flex flex-col items-center cursor-pointer animate-bounce">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-600 text-white shadow-xl border-2 border-white">
              <span style="font-size: 14px;">🚧</span>
            </div>
            <div class="mt-0.5 whitespace-nowrap rounded bg-rose-900 px-1.5 py-0.5 text-[9px] font-black text-rose-100 shadow-md">
              Kondapur Chokepoint (+6m)
            </div>
          </div>
        `,
        iconSize: [130, 45],
        iconAnchor: [65, 20]
      });

      const incMarker = L.marker([17.4640, 78.3680], { icon: incidentIcon })
        .addTo(map)
        .bindPopup(`
          <div class="p-1 space-y-1">
            <div class="flex items-center gap-1 text-rose-700 font-bold text-xs">
              <span>⚠ Severe Congestion Alert</span>
            </div>
            <p class="text-[11px] text-slate-600">Kondapur Junction bottleneck causing ~6m transit friction.</p>
            <p class="text-[10px] text-cyan-700 font-semibold">AI recommendation: Route C (Knowledge City Green Corridor) bypass.</p>
          </div>
        `);
      incidentMarkersRef.current.push(incMarker);
    }
  }, [conditions.trafficLevel, conditions.roadCondition, conditions.storeStatus]);

  // Update Route Polylines
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !prediction?.availableRoutes) return;

    // Clear previous polylines
    if (activeRoutePolylineRef.current) activeRoutePolylineRef.current.remove();
    altRoutePolylinesRef.current.forEach(p => p.remove());
    altRoutePolylinesRef.current = [];
    trafficSegmentPolylinesRef.current.forEach(p => p.remove());
    trafficSegmentPolylinesRef.current = [];

    const availableRoutes = prediction.availableRoutes;

    // Draw alternative routes (faded dashed paths)
    availableRoutes.forEach(route => {
      if (route.id === activeRoute.id) return;
      if (!route.geoCoordinates) return;

      const altPoly = L.polyline(route.geoCoordinates, {
        color: '#94a3b8',
        weight: 4,
        dashArray: '6, 8',
        opacity: 0.6,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      altPoly.bindTooltip(`
        <div class="text-xs font-bold text-slate-800">
          ${route.name} (${route.estimatedMinutes}m • ${route.distanceKm}km)
        </div>
      `, { sticky: true });

      altRoutePolylinesRef.current.push(altPoly);
    });

    // Draw active primary route
    if (activeRoute.geoCoordinates) {
      const activePoly = L.polyline(activeRoute.geoCoordinates, {
        color: '#0284c7',
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      activeRoutePolylineRef.current = activePoly;
    }

    // Draw traffic segment colors if enabled
    if (showTraffic && activeRoute.trafficSegments) {
      activeRoute.trafficSegments.forEach(seg => {
        let segColor = '#10b981'; // Green (Clear)
        if (seg.level === 'MEDIUM') segColor = '#eab308'; // Yellow
        if (seg.level === 'HIGH') segColor = '#f97316'; // Orange
        if (seg.level === 'SEVERE') segColor = '#ef4444'; // Red

        const segPoly = L.polyline(seg.coords, {
          color: segColor,
          weight: 4.5,
          opacity: 0.95,
          lineCap: 'round'
        }).addTo(map);

        segPoly.bindTooltip(`
          <div class="text-[11px] font-bold">
            ${seg.name} — <span style="color:${segColor}">${seg.level} Traffic</span>
            ${seg.delayMin ? ` (+${seg.delayMin}m)` : ''}
          </div>
        `, { sticky: true });

        trafficSegmentPolylinesRef.current.push(segPoly);
      });
    }
  }, [activeRoute, prediction?.availableRoutes, showTraffic]);

  // Update Dynamic Courier Marker Position & Heading
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { lat, lng, bearing } = currentCourierGeo;

    const courierHtml = `
      <div class="relative flex flex-col items-center">
        <!-- Radar Pulse Ring -->
        <div class="absolute -top-1 -left-1 h-11 w-11 rounded-full bg-cyan-500/30 courier-pulse-ring pointer-events-none"></div>

        <!-- Vehicle Center Pin with Dynamic Heading -->
        <div class="relative z-10 flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-xl border-2 border-white transition-transform duration-300" style="transform: rotate(${bearing}deg);">
          <span style="font-size: 16px;">🛵</span>
        </div>

        <!-- Live Status Pill Below -->
        <div class="mt-1 whitespace-nowrap rounded-md bg-slate-950/95 px-2 py-0.5 text-[9px] font-black text-cyan-300 shadow-lg border border-cyan-500/40 flex items-center gap-1">
          <span class="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping"></span>
          <span>OUT FOR DELIVERY • ${currentSpeed} km/h</span>
        </div>
      </div>
    `;

    const courierIcon = L.divIcon({
      className: 'custom-courier-marker',
      html: courierHtml,
      iconSize: [140, 56],
      iconAnchor: [70, 20]
    });

    if (!courierMarkerRef.current) {
      const marker = L.marker([lat, lng], { icon: courierIcon }).addTo(map);
      marker.bindPopup(`
        <div class="p-1 space-y-1">
          <h4 class="font-bold text-xs text-slate-900">Delivery Partner (Live)</h4>
          <p class="text-[11px] text-slate-600">Speed: ${currentSpeed} km/h • ${remainingDist} km remaining</p>
          <div class="flex items-center gap-1 text-[10px] text-cyan-700 font-bold">
            <span>ETA: ~${eta} mins</span> • <span>${progress.toFixed(0)}% Progress</span>
          </div>
        </div>
      `);
      courierMarkerRef.current = marker;
    } else {
      courierMarkerRef.current.setLatLng([lat, lng]);
      courierMarkerRef.current.setIcon(courierIcon);
    }

    // Smooth auto-follow if enabled
    if (autoFollow) {
      map.panTo([lat, lng], { animate: true, duration: 0.8 });
    }
  }, [currentCourierGeo, currentSpeed, remainingDist, eta, progress, autoFollow]);

  // Recenter Courier
  const handleRecenterCourier = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.panTo([currentCourierGeo.lat, currentCourierGeo.lng], { animate: true, duration: 0.6 });
    setAutoFollow(true);
  }, [currentCourierGeo]);

  // Fit Entire Route Bounds
  const handleFitRouteBounds = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !activeRoute.geoCoordinates) return;
    const bounds = L.latLngBounds(activeRoute.geoCoordinates);
    map.fitBounds(bounds, { padding: [60, 60], animate: true });
    setAutoFollow(false);
  }, [activeRoute]);

  // Event Log Ticker Data
  const recentEvents = useMemo(() => [
    { time: '4:21 PM', text: '🛵 Partner picked up order at Spice Route Kitchen', type: 'info' },
    { time: '4:24 PM', text: `🚦 Traffic index: ${conditions.trafficLevel} across HITEC corridor`, type: 'traffic' },
    { time: '4:25 PM', text: `🌧 Atmospheric node: ${conditions.weatherCondition.replace('_', ' ')}`, type: 'weather' },
    { time: '4:26 PM', text: `🧠 AI optimized path: ${activeRoute.name.split('—')[0]}`, type: 'ai' },
    { time: '4:28 PM', text: `🎯 Arrival projected at ~${eta} mins (${progress.toFixed(0)}% completed)`, type: 'eta' }
  ], [conditions.trafficLevel, conditions.weatherCondition, activeRoute.name, eta, progress]);

  return (
    <div className={`relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xs ${className}`}>
      
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-white px-5 py-3.5 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white shadow-xs">
            <Navigation className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                AI Live Delivery Navigation
              </h3>
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800 border border-amber-200">
                DEMO SIMULATION • HYDERABAD
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Madhapur → HITEC City → Kondapur → Gachibowli Financial District
            </p>
          </div>
        </div>

        {/* Quick Map Controls Header Action */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoFollow(!autoFollow)}
            className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
              autoFollow
                ? 'border-cyan-400 bg-cyan-50 text-cyan-800 shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
            title="Automatically center on moving courier"
          >
            <Crosshair className={`h-3.5 w-3.5 ${autoFollow ? 'text-cyan-600 animate-spin' : ''}`} />
            <span>Follow Courier</span>
          </button>

          <button
            onClick={handleFitRouteBounds}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
            title="Fit complete route in view"
          >
            <Maximize2 className="h-3.5 w-3.5 text-slate-600" />
            <span className="hidden sm:inline">Fit Route</span>
          </button>

          <button
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all ${
              showTraffic
                ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <Car className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Traffic</span>
          </button>

          <button
            onClick={() => setShowWeatherOverlay(!showWeatherOverlay)}
            className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-bold transition-all ${
              showWeatherOverlay
                ? 'border-blue-300 bg-blue-50 text-blue-800'
                : 'border-slate-200 bg-slate-50 text-slate-500'
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Weather</span>
          </button>

          <button
            onClick={() => setShowLegend(!showLegend)}
            className="rounded-xl border border-slate-200 bg-slate-50 p-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100"
            title="Toggle Map Legend"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Map Container Frame */}
      <div className={`relative w-full ${heightClass}`}>
        
        {/* Leaflet DOM Anchor */}
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full" />

        {/* Atmospheric Weather Overlay (Subtle CSS Particles) */}
        {showWeatherOverlay && (
          <>
            {(conditions.weatherCondition === 'RAIN' || conditions.weatherCondition === 'HEAVY_RAIN') && (
              <div className="absolute inset-0 weather-rain-layer pointer-events-none z-10 opacity-70" />
            )}
            {conditions.weatherCondition === 'STORM' && (
              <div className="absolute inset-0 weather-storm-layer pointer-events-none z-10 opacity-80 bg-slate-900/10" />
            )}
          </>
        )}

        {/* Top-Left Floating Live ETA Card */}
        <div className="absolute top-4 left-4 z-20 w-72 sm:w-80 rounded-2xl border border-slate-200/90 bg-white/95 p-4 shadow-xl backdrop-blur-md transition-all">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              AI Predicted Arrival
            </span>
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
              92% Confident
            </span>
          </div>

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-slate-900 tracking-tight">
                {eta} <span className="text-base font-bold text-cyan-700">MIN</span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                Arriving around ~{new Date(Date.now() + eta * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs font-black text-slate-900">{remainingDist} km left</div>
              <div className="text-[10px] font-mono text-slate-500">{currentSpeed} km/h cruising</div>
            </div>
          </div>

          {/* Environmental Health Checklist */}
          <div className="mt-3 grid grid-cols-3 gap-1.5 pt-2 border-t border-slate-100 text-[10px]">
            <div className="rounded-lg bg-slate-50 p-1.5 text-center border border-slate-100">
              <span className="text-slate-400 block font-bold">Traffic</span>
              <span className={`font-black ${conditions.trafficLevel === 'SEVERE' ? 'text-rose-600' : (conditions.trafficLevel === 'HIGH' ? 'text-amber-600' : 'text-emerald-600')}`}>
                {conditions.trafficLevel}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-1.5 text-center border border-slate-100">
              <span className="text-slate-400 block font-bold">Weather</span>
              <span className="font-black text-slate-700">
                {conditions.weatherCondition.replace('_', ' ')}
              </span>
            </div>

            <div className="rounded-lg bg-slate-50 p-1.5 text-center border border-slate-100">
              <span className="text-slate-400 block font-bold">Health</span>
              <span className="font-black text-emerald-600">
                {deliveryHealth}/100
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right Floating Route Switcher (Mini Route Battle) */}
        <div className="absolute top-4 right-4 z-20 hidden md:flex flex-col gap-2">
          <div className="rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-xl backdrop-blur-md space-y-2 w-64">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="flex items-center gap-1">
                <Compass className="h-3.5 w-3.5 text-cyan-600" />
                <span>Multi-Corridor Routes</span>
              </span>
              <span className="text-[10px] text-cyan-700 font-mono">Live Sync</span>
            </div>

            <div className="space-y-1.5">
              {prediction?.availableRoutes.map(route => {
                const isSelected = activeRoute.id === route.id;
                return (
                  <button
                    key={route.id}
                    onClick={() => selectRoute(route.id)}
                    className={`w-full text-left rounded-xl p-2 text-xs transition-all flex items-center justify-between border ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50/80 font-bold text-cyan-950 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-[11px] truncate">{route.name.split('—')[0]}</div>
                      <div className="text-[10px] text-slate-500">{route.distanceKm} km • {route.estimatedMinutes}m</div>
                    </div>
                    {route.isRecommended && (
                      <span className="rounded bg-cyan-600 px-1.5 py-0.5 text-[9px] font-black text-white">
                        AI BEST
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom-Left AI Event Ticker */}
        {showEvents && (
          <div className="absolute bottom-4 left-4 z-20 hidden sm:block max-w-sm rounded-2xl border border-slate-200/90 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-cyan-600" />
                Live AI Event Timeline
              </span>
              <button
                onClick={() => setShowEvents(false)}
                className="text-[10px] text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>
            <div className="mt-2 space-y-1.5 max-h-28 overflow-y-auto pr-1 text-[11px]">
              {recentEvents.slice(0, 3).map((evt, idx) => (
                <div key={idx} className="flex items-start gap-2 text-slate-600">
                  <span className="font-mono text-[9px] font-bold text-slate-400 shrink-0">{evt.time}</span>
                  <span className="line-clamp-1">{evt.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Collapsible Map Legend (Bottom-Center / Bottom-Right) */}
        {showLegend && (
          <div className="absolute bottom-4 right-14 z-20 w-60 rounded-2xl border border-slate-200/90 bg-white/95 p-3 shadow-xl backdrop-blur-md space-y-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1 font-bold text-slate-800">
              <span>Map Legend & Signals</span>
              <button onClick={() => setShowLegend(false)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="font-bold text-slate-500 text-[10px] uppercase">Traffic Density</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Clear / Normal</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400"></span> Moderate Flow</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-orange-500"></span> Heavy Congestion</div>
              <div className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-500"></span> Severe Blockage</div>
            </div>
            <div className="space-y-1 text-[11px] pt-1 border-t border-slate-100">
              <div className="font-bold text-slate-500 text-[10px] uppercase">Entities</div>
              <div className="flex items-center gap-1.5">🍽 Spice Route Kitchen</div>
              <div className="flex items-center gap-1.5">🛵 Delivery Partner (Live)</div>
              <div className="flex items-center gap-1.5">🏠 Customer Destination</div>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Status Progress Stepper */}
      <div className="border-t border-slate-100 bg-slate-50/70 p-4 sm:px-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-700 pb-2">
          <span>Delivery Lifecycle Progress</span>
          <span className="text-cyan-700 font-mono font-black">{progress.toFixed(0)}% Completed</span>
        </div>
        
        <div className="grid grid-cols-5 gap-1 text-[10px] text-center font-bold">
          <div className={`p-1.5 rounded-lg border ${progress >= 0 ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-white border-slate-200 text-slate-400'}`}>
            ✓ Confirmed
          </div>
          <div className={`p-1.5 rounded-lg border ${progress >= 15 ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-white border-slate-200 text-slate-400'}`}>
            ✓ Preparing
          </div>
          <div className={`p-1.5 rounded-lg border ${progress >= 35 ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-400'}`}>
            ● Out for Delivery
          </div>
          <div className={`p-1.5 rounded-lg border ${progress >= 85 ? 'bg-cyan-50 border-cyan-300 text-cyan-900' : 'bg-white border-slate-200 text-slate-400'}`}>
            ○ Arriving Soon
          </div>
          <div className={`p-1.5 rounded-lg border ${progress >= 100 ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-slate-200 text-slate-400'}`}>
            ○ Delivered
          </div>
        </div>
      </div>

    </div>
  );
};
