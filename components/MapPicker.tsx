"use client";

import "leaflet/dist/leaflet.css";
import { useEffect, useRef, useState } from "react";
import type { Map as LeafletMap, Marker as LeafletMarker } from "leaflet";
import type { SelectedPlace } from "@/lib/types";

// Açılışta haritanın ortalanıp işaretçinin düşeceği yer: Ankara.
const ANKARA = { lat: 39.9334, lng: 32.8597 };

// Haritanın dışına çıkılamayan Türkiye kutusu (güney-batı, kuzey-doğu).
const TURKEY_BOUNDS: [[number, number], [number, number]] = [
  [35.4, 25.4],
  [42.4, 45.0],
];
// Nominatim aramasında kullanılan kutu: sol, üst, sağ, alt (boylam, enlem).
const TR_VIEWBOX = "25.4,42.4,45.0,35.4";

const NOMINATIM = "https://nominatim.openstreetmap.org";

const PIN_HTML = `
<div class="pin-drop">
  <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="pin-g" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" style="stop-color: hsl(var(--espresso-600))"/>
        <stop offset="100%" style="stop-color: hsl(var(--espresso-800))"/>
      </linearGradient>
    </defs>
    <path d="M16 0C7.7 0 1 6.7 1 15c0 10.5 13 25.2 14.1 26.4a1.2 1.2 0 0 0 1.8 0C18 40.2 31 25.5 31 15 31 6.7 24.3 0 16 0Z" fill="url(#pin-g)"/>
    <circle cx="16" cy="15" r="6" style="fill: hsl(var(--cream-50))"/>
  </svg>
</div>`;

/** Uzun adresi kısa 2 parçalı etikete indirger. */
function shorten(text: string): string {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

export default function MapPicker({
  onSelect,
}: {
  onSelect: (place: SelectedPlace | null) => void;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  // Türkiye dışına tıklanırsa işaretçiyi geri götürmek için son geçerli seçim.
  const lastValid = useRef<SelectedPlace>({ name: "Ankara", ...ANKARA });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const LRef = useRef<any>(null);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedName, setSelectedName] = useState("Ankara");
  const [notice, setNotice] = useState<string | null>(null);

  // Açılışta varsayılan seçim Ankara — kullanıcı haritaya dokunmasa da form çalışır.
  useEffect(() => {
    onSelect(lastValid.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Leaflet haritası (yalnızca istemcide) ----
  useEffect(() => {
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !mapEl.current || mapRef.current) return;
      LRef.current = L;

      const map = L.map(mapEl.current, {
        center: [ANKARA.lat, ANKARA.lng],
        zoom: 11,
        minZoom: 5,
        maxZoom: 18,
        maxBounds: L.latLngBounds(TURKEY_BOUNDS),
        maxBoundsViscosity: 1.0,
        zoomControl: true,
        attributionControl: true,
      });

      // Esri "Gray Canvas" — ücretsiz, anahtarsız, sade altlık. Siyah temada
      // koyu, diğerlerinde açık gri. 16'nın üstünde karolar büyütülür.
      const canvas =
        document.documentElement.dataset.theme === "siyah"
          ? "World_Dark_Gray"
          : "World_Light_Gray";
      const esri = (layer: string) =>
        `https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/${canvas}_${layer}/MapServer/tile/{z}/{y}/{x}`;
      L.tileLayer(esri("Base"), {
        maxNativeZoom: 16,
        maxZoom: 18,
        attribution: "Tiles &copy; Esri",
      }).addTo(map);
      L.tileLayer(esri("Reference"), { maxNativeZoom: 16, maxZoom: 18 }).addTo(
        map
      );

      map.on("click", (e: { latlng: { lat: number; lng: number } }) =>
        placeAt(e.latlng.lat, e.latlng.lng)
      );

      mapRef.current = map;
      // Açılışta pin Ankara'ya düşer.
      setMarker(ANKARA.lat, ANKARA.lng);
      // Kart animasyonla açılıyor — yerleşince boyutu yeniden hesapla.
      setTimeout(() => map.invalidateSize(), 300);
    })();

    return () => {
      cancelled = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setMarker = (lat: number, lng: number) => {
    const L = LRef.current;
    const map = mapRef.current;
    if (!L || !map) return;

    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      return;
    }
    const icon = L.divIcon({
      html: PIN_HTML,
      className: "",
      iconSize: [32, 42],
      iconAnchor: [16, 40],
    });
    const marker = L.marker([lat, lng], { icon, draggable: true }).addTo(map);
    marker.on("dragend", () => {
      const p = marker.getLatLng();
      placeAt(p.lat, p.lng);
    });
    markerRef.current = marker;
  };

  const select = (place: SelectedPlace) => {
    lastValid.current = place;
    setSelectedName(place.name);
    setNotice(null);
    onSelect(place);
  };

  const placeAt = async (lat: number, lng: number) => {
    setMarker(lat, lng);
    mapRef.current?.panTo([lat, lng]);

    try {
      const res = await fetch(
        `${NOMINATIM}/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=tr&zoom=18`
      );
      const data = await res.json();
      const country = data?.address?.country_code;
      if (country && country !== "tr") {
        // Türkiye dışı: seçimi geri al.
        const prev = lastValid.current;
        setMarker(prev.lat, prev.lng);
        mapRef.current?.panTo([prev.lat, prev.lng]);
        setNotice("Sadece Türkiye içinden seçebilirsin.");
        return;
      }
      const name = data?.display_name
        ? shorten(data.display_name)
        : `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
      select({ name, lat, lng });
    } catch {
      select({ name: `${lat.toFixed(5)}, ${lng.toFixed(5)}`, lat, lng });
    }
  };

  const choose = (r: NominatimResult) => {
    const lat = parseFloat(r.lat);
    const lng = parseFloat(r.lon);
    setResults([]);
    setQuery("");
    mapRef.current?.setView([lat, lng], 15);
    setMarker(lat, lng);
    select({ name: shorten(r.display_name), lat, lng });
  };

  // ---- Gecikmeli yer arama — yalnızca Türkiye ----
  useEffect(() => {
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    const t = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `${NOMINATIM}/search?format=jsonv2&q=${encodeURIComponent(
            query
          )}&limit=5&accept-language=tr&countrycodes=tr&viewbox=${TR_VIEWBOX}&bounded=1`
        );
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 5) : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div>
      <label className="mb-2.5 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-espresso-500">
        Mekan
      </label>

      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Yer ara (Türkiye)…"
          className="focus-ring w-full rounded-2xl border border-espresso-200 bg-surface/80 px-4 py-3 text-espresso-800 outline-none transition placeholder:text-espresso-500/50"
        />
        {searching && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-espresso-500">
            aranıyor…
          </span>
        )}

        {results.length > 0 && (
          <ul className="glass absolute left-0 right-0 top-[calc(100%+6px)] z-[1200] max-h-56 overflow-auto rounded-2xl p-1.5">
            {results.map((r, i) => (
              <li key={`${r.lat}-${r.lon}-${i}`}>
                <button
                  type="button"
                  onClick={() => choose(r)}
                  className="focus-ring block w-full truncate rounded-xl px-3 py-2 text-left text-sm text-espresso-700 hover:bg-cream-100"
                  title={r.display_name}
                >
                  {shorten(r.display_name)}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div
        ref={mapEl}
        className="mt-3 h-64 w-full overflow-hidden rounded-2xl border border-espresso-200 shadow-inner"
        role="application"
        aria-label="Konum seçme haritası (Türkiye)"
      />

      <p className="mt-2 text-xs text-espresso-500">
        {notice ?? "Haritaya dokunarak ya da işaretçiyi sürükleyerek seç — yalnızca Türkiye."}
      </p>

      {selectedName && (
        <div className="mt-3 inline-flex max-w-full items-center gap-1.5 truncate rounded-full border border-espresso-700 bg-gradient-to-b from-espresso-600 to-espresso-800 px-3.5 py-1.5 text-sm text-cream-50">
          <span aria-hidden>📍</span>
          <span className="truncate">{selectedName}</span>
        </div>
      )}
    </div>
  );
}
