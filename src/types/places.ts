type PlaceId = string;
type Loc = { lat: number; lng: number };
type Place = {
  id: PlaceId;
  level: string;
  type: string;
  rating: number;
  rating_local: number;
  quadkey: string;
  location: Loc;
  bounding_box: { south: number; west: number; north: number; east: number };
  name: string;
  name_suffix: string;
  name_local: string;
  name_en: string;
  name_translated: string | null;
  url: string;
  price: number | null;
  duration_estimate: number;
  marker: string;
  class: { slug: string; name: string };
  categories: string[];
  tag_keys: string[];
  parents: [];
  perex: string;
  customer_rating: number | null;
  hotel_star_rating: number | null;
  hotel_star_rating_unofficial: number | null;
  thumbnail_url: string;
  meta: { tier: number; edited_at: string; is_outdated: boolean };
  tags: [];
  area: number;
  address: string;
  address_is_approximated: boolean;
  address_details: {
    country: string;
    state: string;
    province: string | null;
    city: string;
    postcode: string | null;
    district: string | null;
    street: string | null;
    place: string | null;
    number: string | null;
  };
  admission: string | null;
  email: string | null;
  timezone: string;
  opening_hours_note: string | null;
  is_deleted: boolean;
  phone: string | null;
  description: {
    text: string;
    provider: string | null;
    translation_provider: string;
    link: string | null;
    language_id: string;
  };
  origin_custom_poi: string | null;
  opening_hours_raw: string;
  media_count: number;
  main_media: { usage: {}; media: [] };
  references: [];
  external_ids: [];
  collection_count: number;
  satellite: { image_url: string; bounding_box: {} };
  attributes: {} | null;
  has_shape_geometry: boolean;
  marker_url?: string | undefined;
};
type Places = Place[];
