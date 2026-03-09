import { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Code2, Users, Star } from 'lucide-react';

interface DeveloperGlobeProps {
  userData: any;
  languages: Record<string, number>;
  totalStars: number;
  followers: number;
}

// Simple city-to-coordinates mapping for common developer locations
const locationCoords: Record<string, { lat: number; lng: number; label: string }> = {
  'san francisco': { lat: 37.77, lng: -122.42, label: 'San Francisco, CA' },
  'sf': { lat: 37.77, lng: -122.42, label: 'San Francisco, CA' },
  'new york': { lat: 40.71, lng: -74.01, label: 'New York, NY' },
  'nyc': { lat: 40.71, lng: -74.01, label: 'New York, NY' },
  'london': { lat: 51.51, lng: -0.13, label: 'London, UK' },
  'berlin': { lat: 52.52, lng: 13.41, label: 'Berlin, Germany' },
  'tokyo': { lat: 35.68, lng: 139.69, label: 'Tokyo, Japan' },
  'paris': { lat: 48.86, lng: 2.35, label: 'Paris, France' },
  'seattle': { lat: 47.61, lng: -122.33, label: 'Seattle, WA' },
  'portland': { lat: 45.52, lng: -122.68, label: 'Portland, OR' },
  'austin': { lat: 30.27, lng: -97.74, label: 'Austin, TX' },
  'bangalore': { lat: 12.97, lng: 77.59, label: 'Bangalore, India' },
  'bengaluru': { lat: 12.97, lng: 77.59, label: 'Bangalore, India' },
  'mumbai': { lat: 19.08, lng: 72.88, label: 'Mumbai, India' },
  'toronto': { lat: 43.65, lng: -79.38, label: 'Toronto, Canada' },
  'vancouver': { lat: 49.28, lng: -123.12, label: 'Vancouver, Canada' },
  'singapore': { lat: 1.35, lng: 103.82, label: 'Singapore' },
  'sydney': { lat: -33.87, lng: 151.21, label: 'Sydney, Australia' },
  'melbourne': { lat: -37.81, lng: 144.96, label: 'Melbourne, Australia' },
  'amsterdam': { lat: 52.37, lng: 4.90, label: 'Amsterdam, Netherlands' },
  'stockholm': { lat: 59.33, lng: 18.07, label: 'Stockholm, Sweden' },
  'helsinki': { lat: 60.17, lng: 24.94, label: 'Helsinki, Finland' },
  'beijing': { lat: 39.90, lng: 116.40, label: 'Beijing, China' },
  'shanghai': { lat: 31.23, lng: 121.47, label: 'Shanghai, China' },
  'shenzhen': { lat: 22.54, lng: 114.06, label: 'Shenzhen, China' },
  'seoul': { lat: 37.57, lng: 126.98, label: 'Seoul, Korea' },
  'dublin': { lat: 53.35, lng: -6.26, label: 'Dublin, Ireland' },
  'zurich': { lat: 47.37, lng: 8.54, label: 'Zurich, Switzerland' },
  'munich': { lat: 48.14, lng: 11.58, label: 'Munich, Germany' },
  'boston': { lat: 42.36, lng: -71.06, label: 'Boston, MA' },
  'chicago': { lat: 41.88, lng: -87.63, label: 'Chicago, IL' },
  'los angeles': { lat: 34.05, lng: -118.24, label: 'Los Angeles, CA' },
  'la': { lat: 34.05, lng: -118.24, label: 'Los Angeles, CA' },
  'denver': { lat: 39.74, lng: -104.99, label: 'Denver, CO' },
  'washington': { lat: 38.91, lng: -77.04, label: 'Washington, DC' },
  'dc': { lat: 38.91, lng: -77.04, label: 'Washington, DC' },
  'são paulo': { lat: -23.55, lng: -46.63, label: 'São Paulo, Brazil' },
  'sao paulo': { lat: -23.55, lng: -46.63, label: 'São Paulo, Brazil' },
  'rio': { lat: -22.91, lng: -43.17, label: 'Rio de Janeiro, Brazil' },
  'cape town': { lat: -33.93, lng: 18.42, label: 'Cape Town, South Africa' },
  'nairobi': { lat: -1.29, lng: 36.82, label: 'Nairobi, Kenya' },
  'lagos': { lat: 6.52, lng: 3.38, label: 'Lagos, Nigeria' },
  'tel aviv': { lat: 32.09, lng: 34.78, label: 'Tel Aviv, Israel' },
  'moscow': { lat: 55.76, lng: 37.62, label: 'Moscow, Russia' },
  'dubai': { lat: 25.20, lng: 55.27, label: 'Dubai, UAE' },
  'portland, or': { lat: 45.52, lng: -122.68, label: 'Portland, OR' },
};

// Language → region mapping for hotspot generation
const langRegions: Record<string, { lat: number; lng: number; region: string }[]> = {
  'JavaScript': [
    { lat: 37.77, lng: -122.42, region: 'Silicon Valley' },
    { lat: 51.51, lng: -0.13, region: 'London' },
    { lat: 12.97, lng: 77.59, region: 'Bangalore' },
  ],
  'Python': [
    { lat: 37.77, lng: -122.42, region: 'Bay Area' },
    { lat: 52.52, lng: 13.41, region: 'Berlin' },
    { lat: 35.68, lng: 139.69, region: 'Tokyo' },
  ],
  'TypeScript': [
    { lat: 47.61, lng: -122.33, region: 'Seattle' },
    { lat: 48.86, lng: 2.35, region: 'Paris' },
    { lat: 59.33, lng: 18.07, region: 'Stockholm' },
  ],
  'Java': [
    { lat: 40.71, lng: -74.01, region: 'New York' },
    { lat: 12.97, lng: 77.59, region: 'Bangalore' },
    { lat: 1.35, lng: 103.82, region: 'Singapore' },
  ],
  'C': [
    { lat: 45.52, lng: -122.68, region: 'Portland' },
    { lat: 60.17, lng: 24.94, region: 'Helsinki' },
    { lat: 52.52, lng: 13.41, region: 'Berlin' },
  ],
  'C++': [
    { lat: 48.14, lng: 11.58, region: 'Munich' },
    { lat: 37.77, lng: -122.42, region: 'Bay Area' },
    { lat: 35.68, lng: 139.69, region: 'Tokyo' },
  ],
  'Go': [
    { lat: 37.77, lng: -122.42, region: 'Bay Area' },
    { lat: 47.61, lng: -122.33, region: 'Seattle' },
    { lat: 39.90, lng: 116.40, region: 'Beijing' },
  ],
  'Rust': [
    { lat: 52.52, lng: 13.41, region: 'Berlin' },
    { lat: 47.61, lng: -122.33, region: 'Seattle' },
    { lat: 45.52, lng: -122.68, region: 'Portland' },
  ],
  'Ruby': [
    { lat: 35.68, lng: 139.69, region: 'Tokyo' },
    { lat: 37.77, lng: -122.42, region: 'Bay Area' },
    { lat: 43.65, lng: -79.38, region: 'Toronto' },
  ],
  'Swift': [
    { lat: 37.33, lng: -122.01, region: 'Cupertino' },
    { lat: 51.51, lng: -0.13, region: 'London' },
    { lat: 48.86, lng: 2.35, region: 'Paris' },
  ],
};

function resolveLocation(location: string | null): { lat: number; lng: number; label: string } | null {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  
  // Direct match
  if (locationCoords[lower]) return locationCoords[lower];
  
  // Partial match
  for (const [key, val] of Object.entries(locationCoords)) {
    if (lower.includes(key) || key.includes(lower)) return { ...val, label: location };
  }
  
  return null;
}

// Convert lat/lng to SVG 2D projection (equirectangular)
function project(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

export function DeveloperGlobe({ userData, languages, totalStars, followers }: DeveloperGlobeProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  
  const W = 800, H = 440;

  const userLocation = useMemo(() => resolveLocation(userData.location), [userData.location]);

  const hotspots = useMemo(() => {
    const spots: { lat: number; lng: number; region: string; lang: string; count: number }[] = [];
    const topLangs = Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 5);
    
    topLangs.forEach(([lang, count]) => {
      const regions = langRegions[lang];
      if (regions) {
        regions.forEach((r) => {
          const existing = spots.find((s) => Math.abs(s.lat - r.lat) < 2 && Math.abs(s.lng - r.lng) < 2);
          if (existing) {
            existing.count += count;
          } else {
            spots.push({ ...r, lang, count });
          }
        });
      }
    });

    return spots;
  }, [languages]);

  const maxCount = Math.max(...hotspots.map((h) => h.count), 1);

  // Simplified world map paths (continents as basic shapes)
  const continentPaths = [
    // North America
    "M80,90 L130,70 L170,80 L200,110 L210,140 L195,170 L170,180 L140,190 L120,180 L105,160 L90,140 L75,120 Z",
    // South America
    "M160,210 L185,195 L200,210 L210,240 L215,270 L200,310 L185,330 L170,320 L160,290 L155,260 L150,230 Z",
    // Europe
    "M370,80 L400,70 L430,75 L440,90 L430,110 L415,120 L395,115 L380,110 L370,95 Z",
    // Africa
    "M380,140 L420,130 L445,150 L450,180 L445,220 L430,260 L410,280 L390,275 L375,250 L370,210 L372,175 Z",
    // Asia
    "M440,60 L520,50 L600,55 L650,70 L660,100 L640,130 L600,140 L550,145 L500,140 L460,125 L445,100 L440,80 Z",
    // Australia
    "M600,260 L650,250 L680,260 L685,280 L670,300 L640,305 L615,295 L605,275 Z",
  ];

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <Globe className="w-5 h-5 text-terminal-cyan" />
        <h3 className="font-semibold text-foreground">Developer World Map</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {Object.keys(languages).length} languages • {hotspots.length} hotspots
        </span>
      </div>

      {/* SVG Map */}
      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-surface-sunken">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--surface-sunken)) 100%)' }}
        >
          {/* Grid lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`vline-${i}`}
              x1={i * (W / 12)}
              y1={0}
              x2={i * (W / 12)}
              y2={H}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <line
              key={`hline-${i}`}
              x1={0}
              y1={i * (H / 6)}
              x2={W}
              y2={i * (H / 6)}
              stroke="hsl(var(--border))"
              strokeWidth={0.5}
              opacity={0.3}
            />
          ))}

          {/* Continents */}
          {continentPaths.map((d, i) => (
            <motion.path
              key={i}
              d={d}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={1}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: i * 0.1 }}
            />
          ))}

          {/* Language hotspots */}
          {hotspots.map((spot, i) => {
            const { x, y } = project(spot.lat, spot.lng, W, H);
            const radius = 6 + (spot.count / maxCount) * 14;
            const isHovered = hoveredHotspot === `${spot.lat}-${spot.lng}`;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredHotspot(`${spot.lat}-${spot.lng}`)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{ cursor: 'pointer' }}
              >
                {/* Pulse ring */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={radius + 4}
                  fill="none"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={1}
                  opacity={0.3}
                  initial={{ r: radius }}
                  animate={{ r: [radius, radius + 8, radius], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                />
                {/* Main dot */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isHovered ? radius + 3 : radius}
                  fill="hsl(var(--secondary) / 0.3)"
                  stroke="hsl(var(--secondary))"
                  strokeWidth={1.5}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring' }}
                />
                {/* Center dot */}
                <circle cx={x} cy={y} r={2.5} fill="hsl(var(--secondary))" />

                {/* Tooltip */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 45}
                      y={y - 30}
                      width={90}
                      height={22}
                      rx={4}
                      fill="hsl(var(--card))"
                      stroke="hsl(var(--border))"
                      strokeWidth={1}
                    />
                    <text x={x} y={y - 16} textAnchor="middle" fontSize={9} fill="hsl(var(--foreground))" fontWeight="600">
                      {spot.region}
                    </text>
                    <text x={x} y={y - 7} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
                      {spot.lang} ({spot.count} repos)
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* User location pin */}
          {userLocation && (() => {
            const { x, y } = project(userLocation.lat, userLocation.lng, W, H);
            return (
              <g>
                {/* Glow ring */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={12}
                  fill="hsl(var(--primary) / 0.15)"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  animate={{ r: [12, 18, 12], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                {/* Pin */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={6}
                  fill="hsl(var(--primary))"
                  stroke="hsl(var(--primary-foreground))"
                  strokeWidth={2}
                  initial={{ scale: 0, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 300 }}
                />
                {/* Label */}
                <rect x={x - 50} y={y + 12} width={100} height={18} rx={4} fill="hsl(var(--primary))" />
                <text x={x} y={y + 24} textAnchor="middle" fontSize={8} fill="hsl(var(--primary-foreground))" fontWeight="700">
                  📍 {userLocation.label}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Info cards below map */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { icon: <MapPin className="w-3.5 h-3.5" />, label: 'Location', value: userData.location || 'Unknown' },
          { icon: <Code2 className="w-3.5 h-3.5" />, label: 'Languages', value: Object.keys(languages).length },
          { icon: <Star className="w-3.5 h-3.5" />, label: 'Stars', value: totalStars.toLocaleString() },
          { icon: <Users className="w-3.5 h-3.5" />, label: 'Followers', value: followers.toLocaleString() },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            className="text-center p-3 bg-muted/30 rounded-xl"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="flex justify-center mb-1 text-terminal-cyan">{item.icon}</div>
            <p className="text-xs font-bold text-foreground truncate">{item.value}</p>
            <p className="text-[9px] text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top language hotspot legend */}
      {Object.keys(languages).length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground mb-2">Language Hotspot Legend</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(languages)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 6)
              .map(([lang, count], i) => (
                <motion.span
                  key={lang}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.05 }}
                >
                  {lang} ({count})
                </motion.span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
