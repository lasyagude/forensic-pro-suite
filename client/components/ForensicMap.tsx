'use client';

import 'leaflet/dist/leaflet.css';
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from 'react-leaflet';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useState } from 'react';
import { Database, AlertTriangle } from 'lucide-react';
import L from 'leaflet';
import 'leaflet.heat';

interface CrimeCity {
  id: string;
  rank: number;
  city: string;
  country: string;
  crimeIndex: number;
  safetyIndex: number;
  coordinates: [number, number];
  danger: 'high' | 'medium' | 'low';
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  Caracas: [-66.9036, 10.4806],
  Baltimore: [-76.6122, 39.2904],
  'Port Moresby': [147.1803, -9.4438],
  Durban: [31.0218, -29.8587],
  Johannesburg: [28.0473, -26.2041],
  Kabul: [69.2075, 34.5553],
  'Rio de Janeiro': [-43.1729, -22.9068],
  Natal: [-35.2088, -5.795],
  Fortaleza: [-38.5247, -3.7319],
  'Port Elizabeth': [25.6167, -33.9608],
  Recife: [-34.8813, -8.0476],
  'Port of Spain': [-61.509, 10.666],
  Salvador: [-38.5025, -12.9777],
  Rosario: [-60.669, -32.9468],
  Memphis: [-90.0489, 35.1495],
  Detroit: [-83.0458, 42.3314],
  Lima: [-77.0428, -12.0464],
  Guayaquil: [-79.9186, -2.1894],
  'Sao Paulo': [-46.6333, -23.5505],
  Bogota: [-74.0721, 4.711],
  'Mexico City': [-99.1332, 19.4326],
  'Santo Domingo': [-69.9312, 18.4861],
  'Guatemala City': [-90.5069, 14.6349],
  Havana: [-82.3666, 23.1136],
  'San Salvador': [-89.2182, 13.6929],
  Quito: [-78.4678, -0.1807],
  Puebla: [-98.2063, 19.0414],
  Santiago: [-70.6693, -33.4489],
  'Buenos Aires': [-58.3816, -34.6037],
  'Kuala Lumpur': [101.6869, 3.139],
  Manila: [120.9842, 14.5995],
  Dhaka: [90.4125, 23.8103],
  Lagos: [3.3792, 6.5244],
  Nairobi: [36.8219, -1.2921],
  Cairo: [31.2357, 30.0444],
  Algiers: [3.0588, 36.7538],
  Damascus: [36.2913, 33.5138],
  Tripoli: [13.1875, 32.8872],
  Pretoria: [28.2293, -25.7479],
  Luanda: [13.2343, -8.839],
  Nicosia: [33.4299, 35.1856],
  Moscow: [37.6173, 55.7558],
  Istanbul: [28.9744, 41.0082],
  Athens: [23.7275, 37.9838],
  Rome: [12.4964, 41.9028],
  Paris: [2.3522, 48.8566],
  London: [-0.1276, 51.5074],
  Berlin: [13.405, 52.52],
  Madrid: [-3.7038, 40.4168],
  Barcelona: [2.1734, 41.3851],
  Casablanca: [-7.5898, 33.5731],
  Beirut: [35.5018, 33.8938],
  Karachi: [67.0099, 24.8615],
  Lahore: [74.3587, 31.5204],
  Kolkata: [88.3639, 22.5726],
  Mumbai: [72.8777, 19.076],
  Mangalore: [74.856, 12.9141],
  'New Delhi': [77.209, 28.6139],
  'Hong Kong': [114.1095, 22.3964],
  Singapore: [103.8198, 1.3521],
  Tokyo: [139.6917, 35.6895],
  Seoul: [126.978, 37.5665],
  Bangkok: [100.5018, 13.7563],
  Jakarta: [106.8456, -6.2088],
  Sydney: [151.2093, -33.8688],
  Melbourne: [144.9631, -37.8136],
  Auckland: [174.7633, -36.8485],
  'New York': [-74.006, 40.7128],
  'Los Angeles': [-118.2437, 34.0522],
  Chicago: [-87.6298, 41.8781],
  Houston: [-95.3698, 29.7604],
  Atlanta: [-84.388, 33.749],
  Miami: [-80.1918, 25.7617],
  Washington: [-77.0369, 38.9072],
  Toronto: [-79.3832, 43.6532],
  Vancouver: [-123.1207, 49.2827],
  Montreal: [-73.5673, 45.5017],
};

const COUNTRY_COORDINATES: Record<string, [number, number]> = {
  'United States': [-98.5795, 39.8283],
  Brazil: [-51.9253, -14.235],
  Colombia: [-74.2973, 4.5709],
  Mexico: [-102.5528, 23.6345],
  Venezuela: [-66.5897, 6.4238],
  'South Africa': [22.9375, -30.5595],
  Pakistan: [69.3451, 30.3753],
  Nigeria: [8.6753, 9.082],
  Egypt: [30.8025, 26.8206],
  Indonesia: [113.9213, -0.7893],
  Philippines: [121.774, 12.8797],
  India: [78.9629, 20.5937],
  Australia: [133.7751, -25.2744],
  Canada: [-106.3468, 56.1304],
  France: [2.2137, 46.2276],
  Italy: [12.5674, 41.8719],
  Spain: [-3.7492, 40.4637],
  'United Kingdom': [-3.43597, 55.3781],
  Germany: [10.4515, 51.1657],
  Japan: [138.2529, 36.2048],
  'South Korea': [127.7669, 35.9078],
  China: [104.1954, 35.8617],
};

function getDanger(crimeIndex: number) {
  if (crimeIndex >= 70) return 'high';
  if (crimeIndex >= 60) return 'medium';
  return 'low';
}

function getCrimeColor(crimeIndex: number) {
  if (crimeIndex >= 70) return '#ef4444';
  if (crimeIndex >= 60) return '#f59e0b';
  return '#10b981';
}

function getCoordinates(cityCountry: string): [number, number] {
  const parts = cityCountry.split(',').map((part) => part.trim());
  const city = parts[0];
  const country = parts[parts.length - 1];
  const direct = CITY_COORDINATES[city] || CITY_COORDINATES[`${city}, ${country}`];
  if (direct) return direct;
  if (country && COUNTRY_COORDINATES[country]) {
    return COUNTRY_COORDINATES[country];
  }
  return [0, 0];
}

function HeatmapOverlay({ points }: { points: [number, number, number][] }) {
  const map = useMap();

  useEffect(() => {
    const heat = (L as any).heatLayer(points, {
      radius: 32,
      blur: 24,
      maxZoom: 7,
      gradient: {
        0.2: '#10b981',
        0.4: '#f59e0b',
        0.7: '#ef4444',
      },
    });

    heat.addTo(map);
    return () => {
      heat.remove();
    };
  }, [map, points]);

  return null;
}

function LegendControl() {
  const map = useMap();

  useEffect(() => {
    const legend = L.control({ position: 'topright' });

    legend.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-legend');
      div.style.background = 'rgba(255, 255, 255, 0.92)';
      div.style.border = '1px solid rgba(148, 163, 184, 0.3)';
      div.style.borderRadius = '12px';
      div.style.padding = '10px';
      div.style.fontSize = '12px';
      div.style.color = '#0f172a';
      div.style.boxShadow = '0 10px 30px rgba(15, 23, 42, 0.08)';
      div.innerHTML = `
        <div style="font-weight:700; margin-bottom:0.5rem;">Heat legend</div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;"><span style="width:12px;height:12px;background:#ef4444;border-radius:9999px;display:inline-block;"></span><span>High danger</span></div>
        <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.35rem;"><span style="width:12px;height:12px;background:#f59e0b;border-radius:9999px;display:inline-block;"></span><span>Moderate risk</span></div>
        <div style="display:flex; align-items:center; gap:0.5rem;"><span style="width:12px;height:12px;background:#10b981;border-radius:9999px;display:inline-block;"></span><span>Lower risk</span></div>
      `;
      return div;
    };

    legend.addTo(map);
    return () => {
      legend.remove();
    };
  }, [map]);

  return null;
}

export default function ForensicMap() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const mapFill = isDark ? '#0f172a' : '#f8fafc';
  const mapStroke = isDark ? '#334155' : '#cbd5e1';
  const mapHover = isDark ? '#1e293b' : '#e2e8f0';
  const labelFill = isDark ? '#cbd5e1' : '#475569';

  const [crimeCities, setCrimeCities] = useState<CrimeCity[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [minCrimeIndex, setMinCrimeIndex] = useState(60);

  useEffect(() => {
    const loadCrimeIndex = async () => {
      try {
        const response = await fetch('/api/crimeindex');
        if (!response.ok) throw new Error('Dataset fetch failed');
        const data = await response.json();
        if (!Array.isArray(data.rows)) throw new Error('Invalid dataset format');

        const parsed: CrimeCity[] = data.rows
          .map((row: Record<string, string>, idx: number) => {
            const cityField = row['City'] ?? row['City '] ?? '';
            const crimeValue = Number(row['Crime Index'] ?? row['Crime Index '] ?? '0');
            const safetyValue = Number(row['Safety Index'] ?? row['Safety Index '] ?? '0');
            const parts = cityField.split(',').map((part) => part.trim());
            const coordinates = getCoordinates(cityField);
            return {
              id: `${cityField}-${idx}`,
              rank: Number(row['Rank'] ?? row['Rank '] ?? idx + 1),
              city: cityField,
              country: parts.slice(-1)[0] ?? '',
              crimeIndex: Number.isFinite(crimeValue) ? crimeValue : 0,
              safetyIndex: Number.isFinite(safetyValue) ? safetyValue : 0,
              coordinates,
              danger: getDanger(crimeValue),
            };
          })
          .filter((city) => city.city && (city.coordinates[0] !== 0 || city.coordinates[1] !== 0));

        setCrimeCities(parsed);
      } catch (error) {
        setLoadError('Unable to load the World Crime Index dataset.');
      }
    };

    loadCrimeIndex();
  }, []);

  const visibleCities = useMemo(
    () => crimeCities.filter((city) => city.crimeIndex >= minCrimeIndex),
    [crimeCities, minCrimeIndex]
  );

  const heatPoints = useMemo(
    () =>
      visibleCities.map((city) => {
        const [lng, lat] = city.coordinates;
        const intensity = Math.min(1, Math.max(0.2, (city.crimeIndex - 50) / 35));
        return [lat, lng, intensity] as [number, number, number];
      }),
    [visibleCities]
  );

  const dangerCounts = useMemo(
    () =>
      visibleCities.reduce(
        (acc, city) => {
          acc.total += 1;
          acc[city.danger] += 1;
          return acc;
        },
        { total: 0, high: 0, medium: 0, low: 0 }
      ),
    [visibleCities]
  );

  const topCities = useMemo(
    () => [...visibleCities].sort((a, b) => b.crimeIndex - a.crimeIndex).slice(0, 25),
    [visibleCities]
  );

  return (
    <div className="space-y-4">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">
              World Crime Index Heatmap
            </h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-2 max-w-2xl">
              Real heatmap visualization using Leaflet and the World Crime Index dataset.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[70, 60, 50].map((threshold) => (
              <button
                key={threshold}
                onClick={() => setMinCrimeIndex(threshold)}
                className={`px-3 py-1.5 text-[10px] font-semibold rounded-full transition ${
                  minCrimeIndex === threshold
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {threshold}+
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4 text-[10px] font-mono text-slate-500">
          <Database className="w-3 h-3" />
          <span>
            Showing city heat intensity for Crime Index ≥ {minCrimeIndex}. Red = highest danger.
          </span>
          {loadError && (
            <span className="flex items-center gap-1 text-rose-400"><AlertTriangle className="w-3 h-3" />{loadError}</span>
          )}
        </div>

        <div className="w-full rounded-xl overflow-hidden bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner" style={{ height: '420px' }}>
          <MapContainer center={[20, 0]} zoom={2} minZoom={2} scrollWheelZoom style={{ width: '100%', height: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <HeatmapOverlay points={heatPoints} />
            {crimeCities.map((city) => {
              const [lng, lat] = city.coordinates;
              const markerColor = city.danger === 'low' ? '#10b981' : getCrimeColor(city.crimeIndex);
              return (
                <CircleMarker
                  key={city.id}
                  center={[lat, lng]}
                  radius={city.danger === 'low' ? 7 : 5}
                  pathOptions={{
                    color: markerColor,
                    fillColor: markerColor,
                    fillOpacity: 0.9,
                    weight: 1,
                  }}
                >
                    <Popup>
                      <div className="text-xs">
                        <div className="font-semibold">{city.city}</div>
                        <div>Crime Index: {city.crimeIndex.toFixed(1)}</div>
                        <div>Danger: {city.danger}</div>
                        <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                          Lat: {lat.toFixed(4)}, Lng: {lng.toFixed(4)}
                        </div>
                      </div>
                    </Popup>
                  </CircleMarker>
              );
            })}
            <LegendControl />
          </MapContainer>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 mt-4 text-[10px] font-mono text-slate-500">
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="font-semibold text-slate-900 dark:text-white">Cities shown</div>
            <div className="text-2xl font-bold mt-2 text-emerald-600">{dangerCounts.total}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="font-semibold text-slate-900 dark:text-white">High danger</div>
            <div className="text-2xl font-bold mt-2 text-rose-500">{dangerCounts.high}</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4">
            <div className="font-semibold text-slate-900 dark:text-white">Medium risk</div>
            <div className="text-2xl font-bold mt-2 text-amber-500">{dangerCounts.medium}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Legend</div>
          <div className="space-y-3 text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>Crime Index ≥ 70: High danger</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>Crime Index 60–69: Medium risk</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>Crime Index &lt; 60: Lower risk</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Top cities by crime index</div>
          <div className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
            {topCities.slice(0, 8).map((city) => (
              <div key={city.id} className="flex items-center justify-between gap-3">
                <span>{city.city}</span>
                <span className="font-semibold">{city.crimeIndex.toFixed(1)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
