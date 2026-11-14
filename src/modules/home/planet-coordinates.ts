export type SpherePoint = {
  x: number;
  y: number;
  z: number;
};

/**
 * Converts geographic latitude and longitude (degrees) into a 3D Cartesian
 * point aligned with `public/globe/planet.glb` (`Icosphere.001`), where `+Y`
 * is North, `-Z` faces the Prime Meridian (`0 deg` longitude), and `-X`
 * faces `+90 deg E`.
 */
export function caseLatLngToSpherePoint(
  lat: number,
  lng: number,
  radius: number
): SpherePoint {
  const phi = (lat * Math.PI) / 180;
  const lambda = (lng * Math.PI) / 180;
  const cosPhi = Math.cos(phi);

  return {
    x: -cosPhi * Math.sin(lambda) * radius,
    y: Math.sin(phi) * radius,
    z: -cosPhi * Math.cos(lambda) * radius,
  };
}
