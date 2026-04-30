import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const RASTER_STYLE = {
  version: 8,
  sources: {
    "carto-light": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
        "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      tileSize: 256,
      attribution: "© OpenStreetMap contributors © CARTO",
    },
  },
  layers: [
    { id: "background", type: "background", paint: { "background-color": "#f2ede3" } },
    { id: "carto-light", type: "raster", source: "carto-light" },
  ],
};

export default function LocationsMap({ locations, activeKey, onPick }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: RASTER_STYLE,
      center: [-91.0, 35.0],
      zoom: 6.4,
      minZoom: 5,
      maxZoom: 12,
      attributionControl: { compact: true },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");
    map.on("load", () => setReady(true));
    mapRef.current = map;
    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((loc) => {
      const el = document.createElement("button");
      el.type = "button";
      el.className = `map-pin ${activeKey === loc.key ? "is-active" : ""}`;
      el.setAttribute("aria-label", `${loc.name} clinic`);
      el.innerHTML = `
        <span class="map-pin-dot"></span>
        <span class="map-pin-label">${loc.name}</span>
      `;
      el.addEventListener("click", () => onPick && onPick(loc.key));
      const marker = new maplibregl.Marker({ element: el, anchor: "center" })
        .setLngLat([loc.coords.lng, loc.coords.lat])
        .addTo(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [ready, locations, activeKey, onPick]);

  useEffect(() => {
    if (!ready || !mapRef.current) return;
    const active = locations.find((l) => l.key === activeKey);
    if (!active) return;
    mapRef.current.flyTo({
      center: [active.coords.lng, active.coords.lat],
      zoom: 8.6,
      duration: 1100,
      essential: true,
    });
  }, [ready, activeKey, locations]);

  return (
    <div className="locations-map" aria-label="Interactive map of Harmony Health Clinic locations">
      <div ref={containerRef} className="map-canvas" />
      <style>{`
        .locations-map { position: relative; border-radius: 28px; overflow: hidden; border: 1px solid var(--line); box-shadow: var(--shadow-soft); height: 460px; background: var(--ivory-deep); }
        .map-canvas { width: 100%; height: 100%; }
        .maplibregl-canvas { outline: none; }
        .map-pin { background: none; border: none; padding: 0; cursor: pointer; display: inline-flex; flex-direction: column; align-items: center; gap: 0.25rem; transform: translateY(-2px); }
        .map-pin-dot { width: 14px; height: 14px; border-radius: 999px; background: var(--terracotta); box-shadow: 0 0 0 4px rgba(201,123,90,0.18), 0 8px 18px -6px rgba(168,95,63,0.6); transition: 220ms ease; }
        .map-pin.is-active .map-pin-dot { background: var(--terracotta-deep); box-shadow: 0 0 0 6px rgba(201,123,90,0.28), 0 0 0 12px rgba(201,123,90,0.14), 0 10px 24px -6px rgba(168,95,63,0.7); transform: scale(1.15); }
        .map-pin-label { font-family: "JetBrains Mono", monospace; font-size: 0.7rem; letter-spacing: 0.16em; padding: 0.2rem 0.55rem; border-radius: 999px; background: rgba(255,255,255,0.92); color: var(--forest); border: 1px solid var(--line); }
        .map-pin.is-active .map-pin-label { background: var(--forest); color: var(--ivory); border-color: var(--forest); }
        .maplibregl-ctrl-attrib { font-size: 0.65rem; }
      `}</style>
    </div>
  );
}
