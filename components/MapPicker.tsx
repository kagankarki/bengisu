"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";
import type { SelectedPlace } from "@/lib/types";

// Açılışta haritanın ortalanıp işaretçinin düşeceği yer: Ankara.
const ANKARA = { lat: 39.9334, lng: 32.8597 };

// Haritayı yalnızca Türkiye'ye sınırlayan yaklaşık kutu.
const TURKEY_BOUNDS = { north: 42.3, south: 35.7, west: 25.6, east: 44.9 };

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";

/** Uzun adresi kısa 2 parçalı etikete indirger. */
function shorten(text: string): string {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(", ");
}

export default function MapPicker({
  onSelect,
}: {
  onSelect: (place: SelectedPlace | null) => void;
}) {
  const mapEl = useRef<HTMLDivElement>(null);
  const inputEl = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const geocoderRef = useRef<google.maps.Geocoder | null>(null);

  const [selectedName, setSelectedName] = useState("Ankara");
  const [error, setError] = useState<string | null>(null);

  // Açılışta varsayılan seçimi Ankara yap (anahtar olsa da olmasa da form çalışsın).
  useEffect(() => {
    onSelect({ name: "Ankara", lat: ANKARA.lat, lng: ANKARA.lng });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!API_KEY) {
      setError("Google Maps API anahtarı eksik.");
      return;
    }

    let cancelled = false;
    const loader = new Loader({
      apiKey: API_KEY,
      version: "weekly",
      libraries: ["places"],
    });

    loader
      .load()
      .then((google) => {
        if (cancelled || !mapEl.current) return;

        const map = new google.maps.Map(mapEl.current, {
          center: ANKARA,
          zoom: 11,
          restriction: { latLngBounds: TURKEY_BOUNDS, strictBounds: false },
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });
        mapRef.current = map;
        geocoderRef.current = new google.maps.Geocoder();

        const marker = new google.maps.Marker({
          map,
          position: ANKARA,
          draggable: true,
          animation: google.maps.Animation.DROP,
        });
        markerRef.current = marker;

        // Açılışta Ankara'nın okunur ismini getir.
        reverse(ANKARA.lat, ANKARA.lng);

        map.addListener("click", (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          placeAt(e.latLng.lat(), e.latLng.lng());
        });
        marker.addListener("dragend", () => {
          const p = marker.getPosition();
          if (p) placeAt(p.lat(), p.lng());
        });

        // Yer arama — yalnızca Türkiye.
        if (inputEl.current && google.maps.places) {
          const ac = new google.maps.places.Autocomplete(inputEl.current, {
            componentRestrictions: { country: "tr" },
            fields: ["geometry", "name", "formatted_address"],
          });
          ac.setBounds(TURKEY_BOUNDS);
          ac.addListener("place_changed", () => {
            const pl = ac.getPlace();
            if (!pl.geometry || !pl.geometry.location) return;
            const loc = pl.geometry.location;
            const name = shorten(
              pl.name || pl.formatted_address || "Seçilen konum"
            );
            map.panTo(loc);
            map.setZoom(15);
            marker.setPosition(loc);
            setSelectedName(name);
            onSelect({ name, lat: loc.lat(), lng: loc.lng() });
          });
        }
      })
      .catch((err) => {
        console.error("[MapPicker] Google Maps yüklenemedi:", err);
        setError("Harita yüklenemedi — API anahtarını kontrol et.");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const placeAt = (lat: number, lng: number) => {
    markerRef.current?.setPosition({ lat, lng });
    mapRef.current?.panTo({ lat, lng });
    reverse(lat, lng);
  };

  const reverse = (lat: number, lng: number) => {
    const fallback = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
    setSelectedName(fallback);
    onSelect({ name: fallback, lat, lng });
    geocoderRef.current?.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === "OK" && results && results[0]) {
          const name = shorten(results[0].formatted_address);
          setSelectedName(name);
          onSelect({ name, lat, lng });
        }
      }
    );
  };

  return (
    <div>
      <label className="mb-2.5 block text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-espresso-500">
        Mekan
      </label>

      {!error && (
        <input
          ref={inputEl}
          type="text"
          placeholder="Yer ara (Türkiye)…"
          className="focus-ring mb-3 w-full rounded-2xl border border-espresso-200 bg-white/80 px-4 py-3 text-espresso-800 outline-none transition placeholder:text-espresso-500/50"
        />
      )}

      {error ? (
        <div className="rounded-2xl border border-espresso-200 bg-white/70 px-4 py-6 text-center text-sm text-espresso-500">
          ⚠️ {error}
          <br />
          Varsayılan olarak <span className="font-semibold">Ankara</span> seçildi.
        </div>
      ) : (
        <div
          ref={mapEl}
          className="h-64 w-full overflow-hidden rounded-2xl border border-espresso-200 shadow-inner"
          role="application"
          aria-label="Konum seçme haritası (Türkiye)"
        />
      )}

      <p className="mt-2 text-xs text-espresso-500">
        Haritaya dokunarak ya da işaretçiyi sürükleyerek seç — yalnızca Türkiye.
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
