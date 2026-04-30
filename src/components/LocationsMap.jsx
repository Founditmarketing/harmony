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
    { id: "background", type: "background", paint: { "background-color": "#dceaf7" } },
    { id: "carto-light", type: "raster", source: "carto-light" },
  ],
};

export default function LocationsMap({ locations, activeKey, onPick }) {
  const mapRef = useRef(null);
  const wrapRef = useRef(null);
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
    mapRef.current.resize();
  }, [ready]);

  useEffect(() => {
    if (!ready || !mapRef.current || !wrapRef.current) return;
    const map = mapRef.current;
    const ro = new ResizeObserver(() => {
      map.resize();
    });
    ro.observe(wrapRef.current);
    const onOrient = () => window.setTimeout(() => map.resize(), 380);
    window.addEventListener("orientationchange", onOrient);
    return () => {
      ro.disconnect();
      window.removeEventListener("orientationchange", onOrient);
    };
  }, [ready]);

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
    <div ref={wrapRef} className="locations-map" aria-label="Interactive map of Harmony Health Clinic locations">
      <div ref={containerRef} className="map-canvas" />
      <style>{`
        .locations-map {
          position: relative;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;
          border-radius: 28px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.55);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.65), var(--glass-shadow);
          height: clamp(300px, 42vw, 480px);
          min-height: 280px;
          background: rgba(255,255,255,0.35);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
        }
        .map-canvas { width: 100%; height: 100%; position: relative; z-index: 0; }
        .maplibregl-canvas { outline: none; max-width: 100%; }
        .map-pin { background: none; border: none; padding: 0; cursor: pointer; display: inline-flex; flex-direction: column; align-items: center; gap: 0.25rem; transform: translateY(-2px); }
        .map-pin-dot { width: 14px; height: 14px; border-radius: 999px; background: var(--terracotta-deep); box-shadow: 0 0 0 4px rgba(56,189,248,0.22), 0 8px 18px -6px rgba(14,116,188,0.55); transition: 220ms ease; }
        .map-pin.is-active .map-pin-dot { background: var(--forest); box-shadow: 0 0 0 6px rgba(56,189,248,0.28), 0 0 0 12px rgba(56,189,248,0.12), 0 10px 24px -6px rgba(14,116,188,0.55); transform: scale(1.15); }
        .map-pin-label { font-family: "JetBrains Mono", monospace; font-size: 0.7rem; letter-spacing: 0.16em; padding: 0.2rem 0.55rem; border-radius: 999px; background: rgba(255,255,255,0.88); backdrop-filter: blur(8px); color: var(--forest-deep); border: 1px solid rgba(255,255,255,0.55); max-width: 120px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .map-pin.is-active .map-pin-label { background: var(--forest); color: var(--ivory); border-color: var(--forest); max-width: 140px; }
        .maplibregl-ctrl-attrib { font-size: 0.62rem; max-width: calc(100% - 56px); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        @media (max-width: 720px) {
          .locations-map {
            height: max(220px, min(44vh, 360px));
            min-height: 220px;
            border-radius: 20px;
          }
          .map-pin-label { font-size: 0.56rem; letter-spacing: 0.1em; padding: 0.15rem 0.42rem; max-width: 76px; }
          .map-pin.is-active .map-pin-label { max-width: 100px; }
          .locations-map .maplibregl-ctrl-top-right { transform: scale(0.9); transform-origin: top right; }
          .locations-map .maplibregl-ctrl-attrib-inner { padding: 2px 4px; }
        }
      `}</style>
    </div>
  );
}
