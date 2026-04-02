import { useMemo, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Globe, MapPin, Code2, Users, Star } from 'lucide-react';

interface DeveloperGlobeProps {
  userData: any;
  languages: Record<string, number>;
  totalStars: number;
  followers: number;
}

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
  'portland, or': { lat: 45.52, lng: -122.68, label: 'Portland, OR' },
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
};

const langRegions: Record<string, { lat: number; lng: number; region: string }[]> = {
  'JavaScript': [{ lat: 37.77, lng: -122.42, region: 'Silicon Valley' }, { lat: 51.51, lng: -0.13, region: 'London' }, { lat: 12.97, lng: 77.59, region: 'Bangalore' }],
  'Python': [{ lat: 37.77, lng: -122.42, region: 'Bay Area' }, { lat: 52.52, lng: 13.41, region: 'Berlin' }, { lat: 35.68, lng: 139.69, region: 'Tokyo' }],
  'TypeScript': [{ lat: 47.61, lng: -122.33, region: 'Seattle' }, { lat: 48.86, lng: 2.35, region: 'Paris' }, { lat: 59.33, lng: 18.07, region: 'Stockholm' }],
  'Java': [{ lat: 40.71, lng: -74.01, region: 'New York' }, { lat: 12.97, lng: 77.59, region: 'Bangalore' }, { lat: 1.35, lng: 103.82, region: 'Singapore' }],
  'C': [{ lat: 45.52, lng: -122.68, region: 'Portland' }, { lat: 60.17, lng: 24.94, region: 'Helsinki' }, { lat: 52.52, lng: 13.41, region: 'Berlin' }],
  'C++': [{ lat: 48.14, lng: 11.58, region: 'Munich' }, { lat: 37.77, lng: -122.42, region: 'Bay Area' }, { lat: 35.68, lng: 139.69, region: 'Tokyo' }],
  'Go': [{ lat: 37.77, lng: -122.42, region: 'Bay Area' }, { lat: 47.61, lng: -122.33, region: 'Seattle' }, { lat: 39.90, lng: 116.40, region: 'Beijing' }],
  'Rust': [{ lat: 52.52, lng: 13.41, region: 'Berlin' }, { lat: 47.61, lng: -122.33, region: 'Seattle' }, { lat: 45.52, lng: -122.68, region: 'Portland' }],
  'Ruby': [{ lat: 35.68, lng: 139.69, region: 'Tokyo' }, { lat: 37.77, lng: -122.42, region: 'Bay Area' }, { lat: 43.65, lng: -79.38, region: 'Toronto' }],
  'Swift': [{ lat: 37.33, lng: -122.01, region: 'Cupertino' }, { lat: 51.51, lng: -0.13, region: 'London' }, { lat: 48.86, lng: 2.35, region: 'Paris' }],
};

function resolveLocation(location: string | null): { lat: number; lng: number; label: string } | null {
  if (!location) return null;
  const lower = location.toLowerCase().trim();
  if (locationCoords[lower]) return locationCoords[lower];
  for (const [key, val] of Object.entries(locationCoords)) {
    if (lower.includes(key) || key.includes(lower)) return { ...val, label: location };
  }
  return null;
}

function project(lat: number, lng: number, width: number, height: number) {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
}

// Realistic simplified continent paths (equirectangular projection, 800x440 viewBox)
const continentPaths = [
  // North America
  { name: 'North America', d: 'M52,105 L58,95 L68,88 L85,80 L100,78 L115,72 L130,68 L148,70 L162,72 L170,78 L180,85 L188,92 L192,100 L198,108 L204,118 L208,128 L210,138 L206,148 L200,156 L194,162 L186,168 L178,172 L170,176 L164,180 L156,182 L148,178 L140,172 L136,165 L128,160 L120,158 L112,155 L108,150 L100,148 L92,145 L85,140 L78,135 L72,128 L66,120 L60,115 L55,110 Z' },
  // Central America + Caribbean
  { name: 'Central America', d: 'M140,172 L148,178 L155,185 L160,192 L158,198 L152,200 L148,195 L142,190 L138,185 L136,180 L138,175 Z' },
  // South America
  { name: 'South America', d: 'M158,198 L168,195 L178,198 L188,205 L196,215 L200,228 L204,242 L206,258 L204,275 L200,290 L194,305 L188,318 L182,328 L176,334 L170,330 L165,322 L160,310 L156,295 L152,278 L150,260 L148,245 L148,232 L150,218 L154,208 Z' },
  // Europe
  { name: 'Europe', d: 'M358,72 L365,68 L375,65 L385,62 L395,60 L405,58 L415,60 L425,62 L432,68 L438,75 L440,82 L438,90 L435,98 L430,105 L424,110 L418,115 L410,118 L402,120 L395,118 L388,115 L382,110 L378,105 L372,98 L368,92 L362,85 L358,78 Z' },
  // British Isles
  { name: 'UK', d: 'M355,72 L358,68 L362,66 L365,68 L366,72 L364,76 L360,78 L356,76 Z' },
  // Scandinavia
  { name: 'Scandinavia', d: 'M390,42 L396,38 L402,35 L408,38 L412,44 L414,52 L412,58 L408,62 L404,58 L398,54 L394,50 L392,46 Z' },
  // Africa
  { name: 'Africa', d: 'M370,130 L378,125 L388,122 L398,120 L410,122 L420,126 L430,132 L438,140 L442,150 L446,162 L448,175 L448,190 L446,205 L442,220 L438,235 L432,248 L425,260 L418,270 L410,278 L402,282 L394,280 L386,274 L380,265 L375,255 L370,242 L368,228 L366,215 L365,200 L365,185 L366,170 L368,155 L369,142 Z' },
  // Asia (mainland)
  { name: 'Asia', d: 'M440,42 L460,38 L480,35 L500,32 L520,30 L545,32 L565,35 L585,38 L605,42 L625,48 L640,55 L650,62 L658,72 L662,82 L660,95 L655,108 L648,118 L638,128 L625,135 L612,140 L598,142 L585,145 L570,148 L558,150 L545,148 L535,145 L525,142 L515,138 L505,135 L495,130 L485,125 L475,120 L465,115 L458,108 L452,100 L448,92 L445,82 L442,72 L440,60 Z' },
  // India
  { name: 'India', d: 'M515,138 L525,142 L530,150 L535,160 L536,172 L534,182 L530,192 L524,198 L518,195 L514,188 L510,178 L508,168 L508,158 L510,148 Z' },
  // Southeast Asia
  { name: 'SE Asia', d: 'M570,148 L580,152 L588,158 L595,165 L598,172 L596,180 L590,185 L582,182 L575,175 L570,168 L568,160 L568,152 Z' },
  // Japan
  { name: 'Japan', d: 'M650,72 L655,68 L660,70 L662,76 L660,82 L656,88 L652,92 L648,88 L646,82 L648,76 Z' },
  // Australia
  { name: 'Australia', d: 'M590,258 L605,250 L620,245 L638,242 L655,245 L668,252 L678,262 L682,275 L680,288 L672,300 L660,308 L645,312 L628,310 L612,305 L600,296 L592,285 L588,272 Z' },
  // New Zealand
  { name: 'NZ', d: 'M700,300 L705,295 L708,300 L710,308 L708,315 L704,318 L700,314 L698,308 Z' },
  // Indonesia
  { name: 'Indonesia', d: 'M575,195 L585,192 L598,195 L612,198 L625,200 L635,205 L640,210 L632,212 L618,210 L605,208 L592,205 L580,202 L575,198 Z' },
  // Middle East
  { name: 'Middle East', d: 'M440,108 L450,105 L460,108 L468,115 L472,125 L470,135 L465,140 L458,142 L452,138 L448,130 L445,120 L442,115 Z' },
  // Greenland
  { name: 'Greenland', d: 'M240,28 L255,22 L270,20 L285,22 L295,28 L300,38 L298,48 L290,55 L278,58 L265,56 L255,50 L248,42 L242,35 Z' },
  // Madagascar
  { name: 'Madagascar', d: 'M448,260 L452,255 L456,260 L458,270 L456,278 L452,282 L448,278 L446,270 Z' },
];

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
          if (existing) { existing.count += count; } else { spots.push({ ...r, lang, count }); }
        });
      }
    });
    return spots;
  }, [languages]);

  const maxCount = Math.max(...hotspots.map((h) => h.count), 1);

  return (
    <div className="glass-panel p-5">
      <div className="flex items-center gap-2 mb-5 pb-3 border-b border-border">
        <Globe className="w-5 h-5 text-terminal-cyan" />
        <h3 className="font-semibold text-foreground">Developer World Map</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          {Object.keys(languages).length} languages • {hotspots.length} hotspots
        </span>
      </div>

      <div className="relative rounded-xl overflow-hidden border border-border/50 bg-surface-sunken">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-auto"
          style={{ background: 'linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--surface-sunken)) 100%)' }}
        >
          {/* Grid lines */}
          {Array.from({ length: 24 }).map((_, i) => (
            <line key={`v${i}`} x1={i * (W / 24)} y1={0} x2={i * (W / 24)} y2={H}
              stroke="hsl(var(--border))" strokeWidth={0.3} opacity={0.2} />
          ))}
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * (H / 12)} x2={W} y2={i * (H / 12)}
              stroke="hsl(var(--border))" strokeWidth={0.3} opacity={0.2} />
          ))}
          {/* Equator */}
          <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="hsl(var(--primary))" strokeWidth={0.5} opacity={0.15} strokeDasharray="4 4" />
          {/* Prime meridian */}
          <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="hsl(var(--primary))" strokeWidth={0.5} opacity={0.15} strokeDasharray="4 4" />

          {/* Continents */}
          {continentPaths.map((cont, i) => (
            <motion.path
              key={cont.name}
              d={cont.d}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={0.8}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: i * 0.05 }}
            />
          ))}

          {/* Language hotspots */}
          {hotspots.map((spot, i) => {
            const { x, y } = project(spot.lat, spot.lng, W, H);
            const radius = 6 + (spot.count / maxCount) * 14;
            const isHovered = hoveredHotspot === `${spot.lat}-${spot.lng}`;

            return (
              <g key={i}
                onMouseEnter={() => setHoveredHotspot(`${spot.lat}-${spot.lng}`)}
                onMouseLeave={() => setHoveredHotspot(null)}
                style={{ cursor: 'pointer' }}
              >
                <motion.circle cx={x} cy={y} r={radius + 4} fill="none"
                  stroke="hsl(var(--secondary))" strokeWidth={1} opacity={0.3}
                  animate={{ r: [radius, radius + 8, radius], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2 + Math.random(), repeat: Infinity, delay: i * 0.2 }}
                />
                <motion.circle cx={x} cy={y} r={isHovered ? radius + 3 : radius}
                  fill="hsl(var(--secondary) / 0.3)" stroke="hsl(var(--secondary))" strokeWidth={1.5}
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.06, type: 'spring' }}
                />
                <circle cx={x} cy={y} r={2.5} fill="hsl(var(--secondary))" />
                {isHovered && (
                  <g>
                    <rect x={x - 50} y={y - 32} width={100} height={24} rx={6}
                      fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth={1} />
                    <text x={x} y={y - 18} textAnchor="middle" fontSize={9} fill="hsl(var(--foreground))" fontWeight="600">
                      {spot.region}
                    </text>
                    <text x={x} y={y - 8} textAnchor="middle" fontSize={7} fill="hsl(var(--muted-foreground))">
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
                <motion.circle cx={x} cy={y} r={12}
                  fill="hsl(var(--primary) / 0.15)" stroke="hsl(var(--primary))" strokeWidth={2}
                  animate={{ r: [12, 18, 12], opacity: [0.5, 0.1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.circle cx={x} cy={y} r={6}
                  fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" strokeWidth={2}
                  initial={{ scale: 0, y: -20 }} animate={{ scale: 1, y: 0 }}
                  transition={{ delay: 1, type: 'spring', stiffness: 300 }}
                />
                <rect x={x - 55} y={y + 12} width={110} height={18} rx={6} fill="hsl(var(--primary))" />
                <text x={x} y={y + 24} textAnchor="middle" fontSize={8} fill="hsl(var(--primary-foreground))" fontWeight="700">
                  📍 {userLocation.label}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { icon: <MapPin className="w-3.5 h-3.5" />, label: 'Location', value: userData.location || 'Unknown' },
          { icon: <Code2 className="w-3.5 h-3.5" />, label: 'Languages', value: Object.keys(languages).length },
          { icon: <Star className="w-3.5 h-3.5" />, label: 'Stars', value: totalStars.toLocaleString() },
          { icon: <Users className="w-3.5 h-3.5" />, label: 'Followers', value: followers.toLocaleString() },
        ].map((item, i) => (
          <motion.div key={item.label} className="text-center p-3 bg-muted/30 rounded-xl"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
          >
            <div className="flex justify-center mb-1 text-terminal-cyan">{item.icon}</div>
            <p className="text-xs font-bold text-foreground truncate">{item.value}</p>
            <p className="text-[9px] text-muted-foreground">{item.label}</p>
          </motion.div>
        ))}
      </div>

      {Object.keys(languages).length > 0 && (
        <div className="mt-4 pt-3 border-t border-border/50">
          <p className="text-[10px] text-muted-foreground mb-2">Language Hotspot Legend</p>
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(languages).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([lang, count], i) => (
              <motion.span key={lang}
                className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
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
