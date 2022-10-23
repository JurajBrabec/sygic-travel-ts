type LegTime = { datetime_local: string | null; datetime: string | null };
type Direction = {
  distance: number;
  duration: number;
  route_id: string;
  mode: TransportMode;
  source: string;
  transfer_count: number;
  legs: Legs;
  attributions: [];
  is_approximated: boolean;
};
type LegPoint = {
  name: string | null;
  location: Loc;
  arrival_at: LegTime;
  departure_at: LegTime;
  planned_arrival_at: LegTime;
  planned_departure_at: LegTime;
};
type Leg = {
  start_time: LegTime;
  end_time: LegTime;
  duration: number;
  distance: number;
  polyline: string;
  origin: LegPoint;
  destination: LegPoint;
  intermediate_stops: [];
  display_info: {
    name_short: string | null;
    name_long: string | null;
    headsign: string | null;
    line_color: string | null;
    display_mode: string | null;
  };
  attribution: string | null;
};
type Legs = Leg[];
type Path = {
  origin: Loc;
  destination: Loc;
  directions: Direction[];
};
type Paths = Path[];
