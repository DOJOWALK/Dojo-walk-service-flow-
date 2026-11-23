# OpenStreetMap integration

The mobile map UI uses OpenStreetMap-derived tiles and shows visible attribution. Configure `EXPO_PUBLIC_OSM_TILE_URL` to the tile provider's documented template, for example `https://provider.example/{z}/{x}/{y}.png`. Do not commit provider keys.

The public OSMF raster endpoint is community-funded and best-effort, not an unlimited commercial service. Its tile policy requires visible attribution, appropriate app identification, valid web Referer, cache compliance and prohibits bulk/offline prefetch. For a commercial managed dog-walking service, select a suitable OSM-derived provider or self-host tiles before launch. Keep tile URL configurable so provider changes do not require app source rewrites.

Routing and geocoding are separate services from map display. Choose providers and their terms independently. Do not send customer names, phone numbers or other personal data to public map services.
