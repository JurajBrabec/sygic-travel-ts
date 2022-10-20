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
type Place = {
  place_id: string;
  start_time: number | null;
  duration: number | null;
  note: string | null;
  transport_from_previous: Transport | null;
};
type Itinerary = Place[];

type TripDay = {
  itinerary: Itinerary;
  note: string | null;
};
type TripDays = TripDay[];
type Trip = {
  id: string;
  owner_id: string;
  name: string;
  version: number;
  url: string;
  updated_at: string;
  is_deleted: boolean;
  privacy_level: string;
  privileges: {
    edit: boolean;
    manage: boolean;
    delete: boolean;
    join: boolean;
  };
  starts_on: string;
  ends_on: string;
  media: {
    square: { id: string; url_template: string } | null;
    landscape: { id: string; url_template: string } | null;
    portrait: { id: string; url_template: string } | null;
    video_preview: { id: string; url_template: string } | null;
  };
  day_count: number;
  user_is_subscribed: boolean;
  days: TripDays;
  destinations: string[];
};
type TripList = Trip[];

type User = {
  id: string;
  is_sso_user: boolean;
  name: string;
  email: string;
  api_key: string | null;
  api_key_type: string | null;
  measurement_unit: string;
  fb_id: string | null;
  ga_id: string | null;
  just_created: boolean;
  roles: string[];
  created_date: string;
  affiliate_id: string | null;
  is_email_subscribed: boolean;
  is_registered: boolean;
  photo: { url: string };
  privacy_consents: {
    type: string;
    agreed: boolean;
    answered_at: string | null;
  }[];
  premium: {
    is_active: boolean;
    name: string;
    type: string;
    expiration_at: string | null;
    product_id: string;
  };
};

interface ISygicTravel {
  places: [];
  routes: [];
  tripId: string | null;
  tripList: TripList | null;
  user: User | null;
  selectDay(dayIndex: number): Promise<[TripDay]>;
  getTripList(): Promise<TripList>;
  getUser(): Promise<User>;
  selectTrip(tripId: string): Promise<Trip>;
}

type HAREntry = {
  page_ref: string;
  startedDateTime: string;
  request: {
    bodySize: number;
    method: string;
    url: string;
    httpVersion: string;
    headers: { name: string; value: string }[];
    cookies: { name: string; value: string }[];
    queryString: { name: string; value: string }[];
    headersSize: number;
    postData?: {
      mimeType: string;
      params: { name: string; value: string }[];
      text: string;
    };
  };
  response: {
    status: number;
    statusText: string;
    headers: { name: string; value: string }[];
    cookies: { name: string; value: string }[];
    content: {
      mimeType: string;
      size: number;
      text: string;
    };
    redirectUrl: string;
    headersSize: number;
    bodySize: number;
  };
  cache: {};
  timings: {
    blocked: number;
    dns: number;
    connect: number;
    ssl: number;
    wait: number;
    receive: number;
  };
  time: number;
  _securityState: string;
  serverIPAddress: string;
  connection: string;
};
type HAREntries = HAREntry[];

interface ISygicTravelHAR extends ISygicTravel {
  entries: HAREntries | null;
  read(HAR: string): Promise<void>;
}

type Credentials = {
  userName: string;
  password: string;
};
type ApiKeys = {
  apiKey: string;
  refreshKey: string;
};

interface ISygicTravelAPI extends ISygicTravel {
  credentials: Credentials | null;
  keys: ApiKeys | null;
  login(credentials: Credentials): Promise<ApiKeys | null>;
}
