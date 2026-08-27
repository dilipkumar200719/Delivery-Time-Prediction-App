import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import { SUPPORTED_CITIES } from '../data/cities';
import {
  Compass,
  MapPin,
  Maximize2,
  Crosshair,
  Phone,
  MessageSquare,
  Bike,
  Star,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { RouteOption } from '../types';

interface RealisticDeliveryMapProps {
  className?: string;
  heightClass?: string;
}

// Reliable high-quality delivery courier avatar
const RIDER_AVATAR_IMG = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';

// Geodesic distance helper for constant-speed interpolation across real road segments
function getSegmentDistanceKm(p1: [number, number], p2: [number, number]): number {
  const R = 6371; // Earth radius in km
  const dLat = ((p2[0] - p1[0]) * Math.PI) / 180;
  const dLng = ((p2[1] - p1[1]) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((p1[0] * Math.PI) / 180) *
      Math.cos((p2[0] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export const RealisticDeliveryMap: React.FC<RealisticDeliveryMapProps> = ({
  className = '',
  heightClass = 'h-[500px] sm:h-[580px]'
}) => {
  const {
    tracking,
    conditions,
    prediction,
    activeOrder,
    selectedCity,
    isDeliveryCompleted,
    isWaitingForOtp,
    setIsOtpModalOpen
  } = useApp();

  const cityInfo = SUPPORTED_CITIES[selectedCity] || SUPPORTED_CITIES.Vijayawada;

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const courierMarkerRef = useRef<L.Marker | null>(null);
  const restaurantMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const activeRoutePolylineRef = useRef<L.Polyline | null>(null);
  const traveledRoutePolylineRef = useRef<L.Polyline | null>(null);
  const altRoutePolylinesRef = useRef<L.Polyline[]>([]);
  const trafficPolylinesRef = useRef<L.Polyline[]>([]);

  // Map Controls State
  const [autoFollow, setAutoFollow] = useState<boolean>(true);
  const [showTraffic, setShowTraffic] = useState<boolean>(true);
  const [showRouteComparison, setShowRouteComparison] = useState<boolean>(false);
  const [isRiderCardOpen, setIsRiderCardOpen] = useState<boolean>(false);
  const [mapTileTheme] = useState<'osm' | 'voyager'>('osm');

  // Dynamic city coordinates & waypoints
  const centerCoord = cityInfo.center;
  const restCoord = cityInfo.restaurantCoord;
  const custCoord = cityInfo.customerCoord;
  const primaryRoadPath = cityInfo.primaryWaypoints;
  const alternateRoadPath = cityInfo.alternateWaypoints;

  // Real-time tracking values
  const rawProgress = tracking?.driverPosition?.progress ?? (isDeliveryCompleted ? 100 : 38);
  const progress = isDeliveryCompleted ? 100 : Math.min(100, Math.max(0, rawProgress));
  const currentSpeed = isDeliveryCompleted ? 0 : (tracking?.speedKmh ?? 29);
  const remainingDist = isDeliveryCompleted ? '0.0' : Math.max(0.1, (3.6 * (1 - progress / 100))).toFixed(1);
  const eta = isDeliveryCompleted ? 0 : (tracking?.etaMinutes ?? 24);

  // High-precision Courier Position & Bearing Calculation along real road route
  const { currentCourierGeo, traveledPath, remainingPath } = useMemo(() => {
    const coords = primaryRoadPath;
    if (!coords || coords.length < 2) {
      return {
        currentCourierGeo: { lat: centerCoord[0], lng: centerCoord[1], bearing: 0 },
        traveledPath: coords,
        remainingPath: coords
      };
    }

    if (progress <= 0) {
      const p1 = coords[0];
      const p2 = coords[1];
      const dLat = p2[0] - p1[0];
      const dLng = p2[1] - p1[1];
      const bearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      return {
        currentCourierGeo: { lat: p1[0], lng: p1[1], bearing },
        traveledPath: [p1],
        remainingPath: coords
      };
    }

    if (progress >= 100) {
      const pLast = coords[coords.length - 1];
      const pPrev = coords[coords.length - 2];
      const dLat = pLast[0] - pPrev[0];
      const dLng = pLast[1] - pPrev[1];
      const bearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      return {
        currentCourierGeo: { lat: pLast[0], lng: pLast[1], bearing },
        traveledPath: coords,
        remainingPath: [pLast]
      };
    }

    // Compute segment distances
    const segmentDistances: number[] = [];
    let totalRouteDistance = 0;
    for (let i = 0; i < coords.length - 1; i++) {
      const d = getSegmentDistanceKm(coords[i], coords[i + 1]);
      segmentDistances.push(d);
      totalRouteDistance += d;
    }

    const targetDistance = totalRouteDistance * (progress / 100);

    let accumulatedDistance = 0;
    let targetSegmentIndex = 0;
    let segmentFraction = 0;

    for (let i = 0; i < segmentDistances.length; i++) {
      const segDist = segmentDistances[i];
      if (accumulatedDistance + segDist >= targetDistance || i === segmentDistances.length - 1) {
        targetSegmentIndex = i;
        const remainingInSeg = targetDistance - accumulatedDistance;
        segmentFraction = segDist > 0 ? Math.min(1, Math.max(0, remainingInSeg / segDist)) : 0;
        break;
      }
      accumulatedDistance += segDist;
    }

    const p1 = coords[targetSegmentIndex];
    const p2 = coords[targetSegmentIndex + 1] || coords[targetSegmentIndex];

    const lat = p1[0] + (p2[0] - p1[0]) * segmentFraction;
    const lng = p1[1] + (p2[1] - p1[1]) * segmentFraction;

    const dLat = p2[0] - p1[0];
    const dLng = p2[1] - p1[1];
    const bearing = (Math.atan2(dLng, dLat) * 180) / Math.PI;

    const currentPoint: [number, number] = [lat, lng];
    const traveled: [number, number][] = [...coords.slice(0, targetSegmentIndex + 1), currentPoint];
    const remaining: [number, number][] = [currentPoint, ...coords.slice(targetSegmentIndex + 1)];

    return {
      currentCourierGeo: { lat, lng, bearing },
      traveledPath: traveled,
      remainingPath: remaining
    };
  }, [primaryRoadPath, progress, centerCoord]);

  // Leaflet Map Initialization
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    try {
      const map = L.map(mapContainerRef.current, {
        center: centerCoord,
        zoom: cityInfo.zoom || 14,
        zoomControl: false,
        attributionControl: false,
        maxZoom: 18,
        minZoom: 11
      });

      // Standard OSM Crisp Tile Layer
      const tileUrl = mapTileTheme === 'osm'
        ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

      const tileSubdomains = mapTileTheme === 'osm' ? ['a', 'b', 'c'] : ['a', 'b', 'c', 'd'];

      L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: tileSubdomains,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);
      mapInstanceRef.current = map;

      // Invalidate sizes for sharp rendering
      const timer1 = setTimeout(() => map.invalidateSize(), 100);
      const timer2 = setTimeout(() => map.invalidateSize(), 400);

      // Disable auto-follow when user manually drags/pans map
      map.on('dragstart', () => {
        setAutoFollow(false);
      });

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (err) {
      console.warn('Map initialization error:', err);
    }
  }, [selectedCity, mapTileTheme]);

  // Handle ResizeObserver
  useEffect(() => {
    if (!mapContainerRef.current) return;
    const ro = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });
    ro.observe(mapContainerRef.current);
    return () => ro.disconnect();
  }, []);

  // Update Restaurant & Customer Home Markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Restaurant Marker (Warm Orange Theme)
    if (restaurantMarkerRef.current) restaurantMarkerRef.current.remove();
    const restIcon = L.divIcon({
      className: 'custom-rest-marker',
      html: `
        <div class="relative flex flex-col items-center cursor-pointer group">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xl border-2 border-white transform group-hover:scale-110 transition-transform">
            <span style="font-size: 20px;">🍽️</span>
          </div>
          <div class="mt-1 whitespace-nowrap rounded-lg bg-slate-900/90 px-2.5 py-0.5 text-[10px] font-black text-amber-300 shadow-md border border-amber-500/30">
            ${cityInfo.restaurantName}
          </div>
        </div>
      `,
      iconSize: [160, 60],
      iconAnchor: [80, 28]
    });

    const rMarker = L.marker(restCoord, { icon: restIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-2.5 space-y-1.5 min-w-[210px]">
          <div class="flex items-center justify-between">
            <h4 class="font-black text-xs text-slate-900">${cityInfo.restaurantName}</h4>
            <span class="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">⭐ ${cityInfo.restaurantRating}</span>
          </div>
          <p class="text-[11px] text-slate-600">${cityInfo.restaurantCuisine}</p>
          <div class="rounded-lg bg-orange-50 p-1.5 text-[10px] font-bold text-orange-900 border border-orange-200">
            Kitchen Preparing • Ready in ~${conditions.restaurantPrepTime || 8} min
          </div>
        </div>
      `);
    restaurantMarkerRef.current = rMarker;

    // 2. Customer Home Destination Marker (Fresh Emerald Green Theme)
    if (customerMarkerRef.current) customerMarkerRef.current.remove();
    const custIcon = L.divIcon({
      className: 'custom-cust-marker',
      html: `
        <div class="relative flex flex-col items-center cursor-pointer group">
          <div class="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xl border-2 border-white transform group-hover:scale-110 transition-transform">
            <span style="font-size: 20px;">🏠</span>
          </div>
          <div class="mt-1 whitespace-nowrap rounded-lg bg-emerald-950 px-2.5 py-0.5 text-[10px] font-black text-emerald-200 shadow-md border border-emerald-700">
            Your Location (Home)
          </div>
        </div>
      `,
      iconSize: [160, 60],
      iconAnchor: [80, 28]
    });

    const cMarker = L.marker(custCoord, { icon: custIcon })
      .addTo(map)
      .bindPopup(`
        <div class="p-2.5 space-y-1.5 min-w-[210px]">
          <h4 class="font-black text-xs text-slate-900">Your Delivery Address</h4>
          <p class="text-[11px] text-slate-600">${cityInfo.customerAddress}</p>
          <div class="rounded-lg bg-emerald-50 p-1.5 text-[10px] font-bold text-emerald-800 border border-emerald-200">
            🟢 Ready for Courier Handover
          </div>
        </div>
      `);
    customerMarkerRef.current = cMarker;

  }, [restCoord, custCoord, cityInfo, conditions.restaurantPrepTime]);

  // Update Route Polylines (Live Traveled vs Upcoming + Traffic)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeRoutePolylineRef.current) activeRoutePolylineRef.current.remove();
    if (traveledRoutePolylineRef.current) traveledRoutePolylineRef.current.remove();
    altRoutePolylinesRef.current.forEach(p => p.remove());
    altRoutePolylinesRef.current = [];
    trafficPolylinesRef.current.forEach(p => p.remove());
    trafficPolylinesRef.current = [];

    // Optional comparison routes
    if (showRouteComparison) {
      const altPoly = L.polyline(alternateRoadPath, {
        color: '#94a3b8',
        weight: 4,
        dashArray: '6, 6',
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map).bindTooltip('Alternate Route (27 min • Moderate Delay)', { permanent: false });
      altRoutePolylinesRef.current.push(altPoly);
    }

    // 1. Full Outer Route Outline / Glow
    const bgBorderPoly = L.polyline(primaryRoadPath, {
      color: '#0284c7',
      weight: 8,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round'
    }).addTo(map);
    altRoutePolylinesRef.current.push(bgBorderPoly);

    // 2. Traveled Route Polyline (Green/Cyan vibrant stroke)
    if (traveledPath.length >= 2) {
      const traveledPoly = L.polyline(traveledPath, {
        color: '#10b981',
        weight: 5,
        opacity: 0.95,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      traveledRoutePolylineRef.current = traveledPoly;
    }

    // 3. Remaining Upcoming Route Polyline (Deep Cyan / Sky stroke)
    if (remainingPath.length >= 2) {
      const remainingPoly = L.polyline(remainingPath, {
        color: '#0284c7',
        weight: 5,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
      activeRoutePolylineRef.current = remainingPoly;
    }

    // 4. Live Traffic Segments
    if (showTraffic && primaryRoadPath.length >= 3) {
      const seg1 = L.polyline([primaryRoadPath[0], primaryRoadPath[1]], { color: '#10b981', weight: 4, opacity: 0.8 }).addTo(map);
      const seg2 = L.polyline([primaryRoadPath[1], primaryRoadPath[2]], { color: '#f59e0b', weight: 4, opacity: 0.8 }).addTo(map);
      const seg3 = L.polyline([primaryRoadPath[2], primaryRoadPath[3] || primaryRoadPath[2]], { color: '#10b981', weight: 4, opacity: 0.8 }).addTo(map);
      trafficPolylinesRef.current.push(seg1, seg2, seg3);
    }
  }, [primaryRoadPath, alternateRoadPath, showRouteComparison, showTraffic, traveledPath, remainingPath]);

  // Update Realistic Delivery Partner Avatar Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { lat, lng, bearing } = currentCourierGeo;

    // Delivery Partner HTML Marker with Image Avatar, Pulse Ring, Vehicle Badge, and Direction Arrow
    const courierHtml = `
      <div class="relative flex flex-col items-center cursor-pointer select-none group" id="leaflet-delivery-rider-marker">
        <!-- Live Radar Ping Wave -->
        ${!isDeliveryCompleted ? '<div class="absolute -top-1.5 -left-1.5 h-16 w-16 rounded-full bg-cyan-500/25 animate-ping pointer-events-none"></div>' : ''}

        <!-- Rider Marker Card with Real Image Avatar -->
        <div class="relative z-10 flex items-center gap-1.5 rounded-2xl bg-white/98 backdrop-blur-md p-1.5 shadow-2xl border-2 ${isDeliveryCompleted ? 'border-emerald-500 ring-2 ring-emerald-300/50' : 'border-cyan-500 ring-2 ring-cyan-300/40'} transform group-hover:scale-105 transition-all">
          
          <!-- Circular Courier Photo / Avatar -->
          <div class="relative h-10 w-10 overflow-hidden rounded-xl border border-slate-200 bg-cyan-50 shadow-inner shrink-0">
            <img 
              src="${RIDER_AVATAR_IMG}" 
              alt="Rahul Kumar - Delivery Partner"
              class="h-full w-full object-cover"
              onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80';"
            />
            <!-- Scooter Icon Badge on Avatar Corner -->
            <span class="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-cyan-600 text-white text-[9px] shadow-xs">
              🛵
            </span>
          </div>

          <!-- Rider Live Telemetry & Name Column -->
          <div class="flex flex-col pr-1 text-left">
            <div class="flex items-center gap-1">
              <span class="h-2 w-2 rounded-full ${isDeliveryCompleted ? 'bg-emerald-500' : 'bg-emerald-500 animate-pulse'}"></span>
              <span class="text-[10px] font-black text-slate-900 tracking-tight leading-tight">Rahul Kumar</span>
            </div>
            <div class="mt-0.5 flex items-center gap-1 text-[9px] font-bold text-cyan-800">
              <span>${isDeliveryCompleted ? 'Delivered' : 'Ather EV'}</span>
              <span class="text-slate-300">•</span>
              <span class="font-mono text-emerald-600">${isDeliveryCompleted ? '0 km/h' : `${currentSpeed} km/h`}</span>
            </div>
          </div>
        </div>

        <!-- Directional Pointer Triangle -->
        <div class="h-0 w-0 border-x-5 border-x-transparent border-t-6 ${isDeliveryCompleted ? 'border-t-emerald-500' : 'border-t-cyan-500'} -mt-0.5 shadow-sm"></div>
      </div>
    `;

    const courierIcon = L.divIcon({
      className: 'custom-courier-marker',
      html: courierHtml,
      iconSize: [160, 56],
      iconAnchor: [80, 28]
    });

    if (!courierMarkerRef.current) {
      const marker = L.marker([lat, lng], { icon: courierIcon, zIndexOffset: 2500 }).addTo(map);
      marker.on('click', () => setIsRiderCardOpen(true));
      courierMarkerRef.current = marker;
    } else {
      courierMarkerRef.current.setLatLng([lat, lng]);
      courierMarkerRef.current.setIcon(courierIcon);
      courierMarkerRef.current.setZIndexOffset(2500);
    }

    // Auto-follow rider when enabled
    if (autoFollow && !isDeliveryCompleted) {
      map.panTo([lat, lng], { animate: true, duration: 0.6 });
    }
  }, [currentCourierGeo, currentSpeed, autoFollow, isDeliveryCompleted]);

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
    if (!map || !primaryRoadPath || primaryRoadPath.length === 0) return;
    try {
      const bounds = L.latLngBounds(primaryRoadPath);
      map.fitBounds(bounds, { padding: [60, 60], animate: true });
      setAutoFollow(false);
    } catch (e) {
      console.warn('Error fitting route bounds:', e);
    }
  }, [primaryRoadPath]);

  return (
    <div className={`overflow-hidden rounded-3xl border border-cyan-100 bg-white shadow-sm ${className}`}>
      
      {/* Top Map Control Bar (Colorful Framing) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cyan-100/80 bg-gradient-to-r from-cyan-50/90 via-sky-50/60 to-emerald-50/40 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-xs">
            <Compass className="h-4.5 w-4.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-tight text-slate-900">
                Live Delivery Route &amp; Real-World Map
              </span>
              <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-900 border border-emerald-200">
                📍 {cityInfo.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">
              {cityInfo.primaryRoads} • {remainingDist} km remaining
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          
          {/* Traffic Toggle */}
          <button
            id="map-traffic-toggle-btn"
            onClick={() => setShowTraffic(!showTraffic)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all border ${
              showTraffic
                ? 'border-emerald-400 bg-emerald-50 text-emerald-900 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
            title="Toggle Live Route Traffic Flow"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>Traffic</span>
          </button>

          {/* Compare Routes Button */}
          <button
            id="map-compare-routes-btn"
            onClick={() => setShowRouteComparison(!showRouteComparison)}
            className={`flex items-center gap-1 rounded-xl px-2.5 py-1.5 text-xs font-bold transition-all border ${
              showRouteComparison
                ? 'border-cyan-400 bg-cyan-50 text-cyan-900 shadow-2xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{showRouteComparison ? 'Hide Alternates' : 'Compare Routes'}</span>
          </button>

          {/* Follow Rider Button */}
          <button
            id="map-follow-rider-btn"
            onClick={handleRecenterCourier}
            className={`flex items-center gap-1 rounded-xl px-3 py-1.5 text-xs font-bold transition-all border ${
              autoFollow
                ? 'border-cyan-600 bg-cyan-600 text-white shadow-xs'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Crosshair className="h-3.5 w-3.5" />
            <span>Follow Rider</span>
          </button>

          {/* Fit Route Button */}
          <button
            id="map-fit-route-btn"
            onClick={handleFitRouteBounds}
            className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-2xs"
          >
            <Maximize2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Fit Route</span>
          </button>
        </div>
      </div>

      {/* Main Leaflet Map Container Canvas */}
      <div className={`relative w-full ${heightClass}`}>
        
        {/* Leaflet DOM container */}
        <div ref={mapContainerRef} className="absolute inset-0 h-full w-full bg-slate-100" />

        {/* Top-Left Floating Live ETA Summary Card */}
        <div className="absolute top-4 left-4 z-20 w-64 sm:w-72 rounded-2xl border border-cyan-200 bg-white/95 p-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-cyan-900 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-cyan-600" />
              {isWaitingForOtp ? 'At Customer Location' : 'AI Predicted Arrival'}
            </span>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold border ${
              isDeliveryCompleted
                ? 'bg-emerald-100 text-emerald-900 border-emerald-200'
                : isWaitingForOtp
                ? 'bg-amber-100 text-amber-950 border-amber-300 animate-pulse'
                : 'bg-emerald-100 text-emerald-900 border-emerald-200'
            }`}>
              {isDeliveryCompleted ? '✓ Completed' : (isWaitingForOtp ? '● Waiting for OTP' : '92% High Confidence')}
            </span>
          </div>

          <div className="pt-2 flex items-baseline justify-between">
            <div>
              {isWaitingForOtp ? (
                <div className="space-y-1">
                  <div className="text-lg font-black text-amber-900">
                    Rider Arrived
                  </div>
                  <button
                    onClick={() => setIsOtpModalOpen(true)}
                    className="rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black px-2.5 py-1 flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                  >
                    <ShieldCheck className="h-3 w-3" />
                    <span>Enter OTP</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-3xl font-black text-slate-900 tracking-tight">
                    {isDeliveryCompleted ? '0' : eta} <span className="text-sm font-bold text-cyan-700">MIN</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mt-0.5">
                    {isDeliveryCompleted
                      ? 'Delivered at Doorstep'
                      : `Expected ~${new Date(Date.now() + eta * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                  </p>
                </>
              )}
            </div>

            <div className="text-right">
              <div className="text-xs font-black text-slate-900">{isWaitingForOtp || isDeliveryCompleted ? 0 : remainingDist} km left</div>
              <div className="text-[10px] font-mono text-emerald-700 font-bold">
                {isDeliveryCompleted ? 'Delivered' : (isWaitingForOtp ? 'At Doorstep' : `${currentSpeed} km/h cruising`)}
              </div>
            </div>
          </div>
        </div>

        {/* Delivery Partner Floating Card (Clickable on Map) */}
        <div className="absolute bottom-4 left-4 z-20 w-72 sm:w-80 rounded-2xl border border-cyan-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <img
                  src={RIDER_AVATAR_IMG}
                  alt="Rahul Kumar"
                  className="h-11 w-11 rounded-2xl object-cover border-2 border-cyan-500 shadow-sm"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[9px] font-bold border-2 border-white">
                  ✓
                </span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-900">Rahul Kumar</span>
                  <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                    <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
                    4.8
                  </span>
                </div>
                <p className="text-[10px] text-slate-600 flex items-center gap-1 mt-0.5">
                  <Bike className="h-3 w-3 text-cyan-600" />
                  <span>Ather 450X EV • {isDeliveryCompleted ? '🟢 Handed Over' : '🟢 On the way'}</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsRiderCardOpen(true)}
              className="rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 px-3 py-1.5 text-xs font-bold border border-cyan-200 transition-colors"
            >
              Partner Card
            </button>
          </div>
        </div>

        {/* Optional Route Comparison Overlay */}
        {showRouteComparison && (
          <div className="absolute top-4 right-4 z-20 w-64 rounded-2xl border border-cyan-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-md space-y-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
              <span className="text-xs font-bold text-slate-900">Corridor Options</span>
              <button
                onClick={() => setShowRouteComparison(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <div className="w-full rounded-xl p-2.5 text-xs border border-cyan-500 bg-cyan-50/80 font-bold text-cyan-950 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Recommended Corridor</span>
                  <span className="rounded bg-cyan-600 px-1.5 py-0.2 text-[9px] font-black text-white">
                    BEST
                  </span>
                </div>
                <div className="text-[10px] text-slate-600 mt-1">
                  24 min • 3.6 km (Fast transit, flyover route)
                </div>
              </div>

              <div className="w-full rounded-xl p-2.5 text-xs border border-slate-200 bg-white text-slate-700">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold">Alternate Side Roads</span>
                  <span className="text-[9px] font-medium text-slate-400">
                    +3 min
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  27 min • 4.1 km (Local market delay)
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Delivery Lifecycle Step Bar */}
      <div className="border-t border-cyan-100 bg-gradient-to-r from-orange-50/40 via-amber-50/20 to-cyan-50/40 p-4 sm:px-6">
        <div className="flex items-center justify-between text-xs font-bold text-slate-800 pb-2">
          <span>Delivery Progress Timeline</span>
          <span className="text-cyan-900 font-mono font-black">{progress.toFixed(0)}% Completed</span>
        </div>
        
        <div className="grid grid-cols-5 gap-1.5 text-[10px] text-center font-bold">
          <div className={`p-2 rounded-xl border transition-all ${progress >= 0 ? 'bg-orange-100 border-orange-300 text-orange-950' : 'bg-white border-slate-200 text-slate-400'}`}>
            ✓ Confirmed
          </div>
          <div className={`p-2 rounded-xl border transition-all ${progress >= 15 ? 'bg-amber-100 border-amber-300 text-amber-950' : 'bg-white border-slate-200 text-slate-400'}`}>
            ✓ Preparing
          </div>
          <div className={`p-2 rounded-xl border transition-all ${progress >= 35 && progress < 85 ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs' : (progress >= 85 ? 'bg-cyan-100 border-cyan-300 text-cyan-950' : 'bg-white border-slate-200 text-slate-400')}`}>
            ● On the Way
          </div>
          <div className={`p-2 rounded-xl border transition-all ${progress >= 85 && progress < 100 ? 'bg-cyan-600 border-cyan-600 text-white shadow-xs' : (progress >= 100 ? 'bg-emerald-100 border-emerald-300 text-emerald-950' : 'bg-white border-slate-200 text-slate-400')}`}>
            ○ Arriving Soon
          </div>
          <div className={`p-2 rounded-xl border transition-all ${progress >= 100 ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs' : 'bg-white border-slate-200 text-slate-400'}`}>
            {progress >= 100 ? '✓ Delivered' : '○ Delivered'}
          </div>
        </div>
      </div>

      {/* Full Delivery Partner Modal */}
      {isRiderCardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative w-full max-w-sm rounded-3xl border border-cyan-100 bg-white p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <Bike className="h-4 w-4 text-cyan-600" />
                <span>Delivery Partner Profile</span>
              </div>
              <button
                onClick={() => setIsRiderCardOpen(false)}
                className="rounded-full bg-slate-100 p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center gap-3.5 pt-1">
              <img
                src={RIDER_AVATAR_IMG}
                alt="Rahul Kumar"
                className="h-16 w-16 rounded-2xl object-cover border-2 border-cyan-500 shadow-md"
              />
              <div>
                <h3 className="text-base font-black text-slate-900">Rahul Kumar</h3>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    4.8 (1,420+ deliveries)
                  </span>
                </div>
                <span className="text-xs text-slate-600 block mt-1">
                  Ather 450X EV • 🟢 Verified Partner
                </span>
              </div>
            </div>

            {/* Current Ride Telemetry */}
            <div className="grid grid-cols-2 gap-2 rounded-2xl bg-cyan-50/70 border border-cyan-200 p-3 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Distance</span>
                <span className="text-sm font-black text-cyan-950">{remainingDist} km</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Estimated ETA</span>
                <span className="text-sm font-black text-cyan-950">{eta} min</span>
              </div>
            </div>

            {/* Delivery Handover PIN */}
            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-3.5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Doorstep Handover PIN</span>
                <span className="text-xs text-slate-600 font-medium">Share with Rahul at delivery</span>
              </div>
              <span className="text-lg font-mono font-black text-cyan-800 bg-cyan-100 px-3 py-1 rounded-xl border border-cyan-300">
                {activeOrder?.deliveryOtp || '8553'}
              </span>
            </div>

            {/* Actions: Call & Message */}
            <div className="grid grid-cols-2 gap-2 pt-2">
              <button
                onClick={() => alert('Connecting call with delivery partner Rahul Kumar (masked privacy proxy)...')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 p-2.5 text-xs font-bold transition-colors"
              >
                <Phone className="h-3.5 w-3.5 text-cyan-700" />
                <span>Call Partner</span>
              </button>
              <button
                onClick={() => alert('Opening live chat message thread with Rahul Kumar.')}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white p-2.5 text-xs font-bold transition-colors"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>Send Note</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
