"use client";


import { useEffect } from "react";
import L from "leaflet";
import type { Feature } from "geojson";
import type { Layer, PathOptions } from "leaflet";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { nepalProvinces } from "@/lib/Nepalprovinces";

type MapLocation = {
  name: string;
  position: [number, number];
  primary?: boolean;
};

const locations: MapLocation[] = [
  { name: "Kathmandu", position: [27.7172, 85.324], primary: true },
  { name: "Pokhara", position: [28.2096, 83.9856] },
  { name: "Chitwan", position: [27.5291, 84.3542] },
  { name: "Biratnagar", position: [26.4525, 87.2718] },
  { name: "Nepalgunj", position: [28.05, 81.6167] },
];

const baseStyle: PathOptions = {
  color: "#0A0E12",
  weight: 1,
  fillColor: "#FBB501",
  fillOpacity: 0.14,
};

const hoverStyle: PathOptions = { weight: 2, fillOpacity: 0.32 };

function onEachProvince(feature: Feature, layer: Layer) {
  const name = (feature.properties as { name?: string })?.name;
  if (name) layer.bindTooltip(name, { sticky: true });

  layer.on({
    mouseover: (e) => e.target.setStyle(hoverStyle),
    mouseout: (e) => e.target.setStyle(baseStyle),
  });
}

/** Fits the whole country into the box, and refits whenever the box resizes. */
function FitNepal() {
  const map = useMap();

  useEffect(() => {
    const bounds = L.geoJSON(nepalProvinces).getBounds();

    const fit = () => {
      map.invalidateSize();
      map.fitBounds(bounds, { padding: [12, 12], animate: false });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export default function NepalMap() {
  return (
    <div className="h-[300px] w-full min-w-0 overflow-hidden border border-border bg-muted/30 sm:h-[380px] lg:h-[320px]">
      <MapContainer
        center={[28.3, 84.1]}
        zoom={6}
        zoomSnap={0.1}
        minZoom={4}
        maxZoom={9}
        scrollWheelZoom={false}
        attributionControl={false}
        className="h-full w-full !bg-transparent"
      >
        <FitNepal />

        {/* No tile layer: the country is drawn from boundary data only. */}
        <GeoJSON
          data={nepalProvinces}
          style={() => baseStyle}
          onEachFeature={onEachProvince}
        />

        {locations.map((location) => (
          <CircleMarker
            key={location.name}
            center={location.position}
            radius={location.primary ? 9 : 7}
            pathOptions={{
              color: "#0A0E12",
              weight: 2,
              fillColor: "#FBB501",
              fillOpacity: 1,
            }}
          >
            <Tooltip direction="top" offset={[0, -6]} permanent>
              {location.name}
            </Tooltip>
          </CircleMarker>
        ))}
      </MapContainer>
    </div>
  );
}