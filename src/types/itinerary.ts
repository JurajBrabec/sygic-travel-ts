type TransportMode =
  | 'boat'
  | 'bus'
  | 'car'
  | 'pedestrian'
  | 'plane'
  | 'public_transit'
  | 'taxi'
  | 'train'
  | 'tram'
  | 'subway';
type Transport = {
  mode: TransportMode;
  avoid: [];
  start_time: number | null;
  duration: number | null;
  note: string | null;
  waypoints: [];
  route_id: string | null;
};
type Point = {
  place_id: PlaceId;
  start_time: number | null;
  duration: number | null;
  note: string | null;
  transport_from_previous: Transport | null;
};
type Itinerary = Point[];
