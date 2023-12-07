import NodeGeocoder from "node-geocoder";

const geocoder = NodeGeocoder({
  provider: "openstreetmap", // Use your preferred geocoding provider
});

export async function getLocationCoordinates(
  userLocation: string
): Promise<{
  latitude: number | undefined;
  longitude: number | undefined;
} | null> {
  try {
    const res = await geocoder.geocode(userLocation);
    if (res.length > 0) {
      const { latitude, longitude } = res[0];
      return { latitude, longitude };
    }
  } catch (error) {
    console.error("Error geocoding user location:", error);
  }

  return null;
}
