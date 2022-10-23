type TripId = string;
type TripMedia = { id: string; url_template: string } | null;
type TripDay = {
  itinerary: Itinerary;
  note: string | null;
};
type TripDays = TripDay[];
type Trip = {
  id: TripId;
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
    square: TripMedia;
    landscape: TripMedia;
    portrait: TripMedia;
    video_preview: TripMedia;
  };
  day_count: number;
  user_is_subscribed: boolean;
  days: TripDays;
  destinations: PlaceId[];
};
type TripList = Trip[];
