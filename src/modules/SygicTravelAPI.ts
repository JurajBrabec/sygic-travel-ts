import SygicTravel from './SygicTravel';

const DEVICE_CODE = '38d561c7-65d4-4c77-ad92-1ee5c30ca36b';
const VERSION = '2.6';
const LANGUAGE = 'en';

const API_URL = 'https://api.sygictraveldata.com/v' + VERSION + '/';

const AUTH_HEADERS = { 'Content-Type': 'application/json' };
const AUTH_URL = 'https://auth.sygic.com/oauth2/token';
const AUTH_BODY: AuthBody = {
  client_id: 'sygictravel_web',
  device_code: DEVICE_CODE,
  device_platform: 'web',
  grant_type: 'password',
  username: '',
  password: '',
};

const MARKERS_URL = 'https://cdn.travel.sygic.com/web/markers/';

export default class SygicTravelAPI
  extends SygicTravel
  implements ISygicTravelAPI
{
  tokens: Tokens | null;
  constructor(options?: Tokens) {
    super();
    this.tokens = null;
    if (options) {
      this.tokens = options;
    }
  }
  protected addPlace(place: Place): void {
    this.places.set(place.id, {
      ...place,
      marker_url:
        MARKERS_URL +
        (place.marker === 'default' ? 'home' : place.marker) +
        '.png',
    });
  }
  protected fetch(url: string, options?: RequestInit): Promise<Response> {
    return new Promise((resolve, reject) => {
      let { method, headers, body } = options || { method: 'GET' };
      if (!/^http/.test(url)) url = API_URL + LANGUAGE + url;
      if (!headers) {
        if (!this.tokens) return reject(new Error('Not authenticated'));
        headers = { Authorization: `Bearer ${this.tokens.access_token}` };
      }
      fetch(url, { method, headers, body }).then(response => {
        response.status === 200
          ? resolve(response)
          : reject(new Error(`${response.status} : ${response.statusText}`));
      });
    });
  }
  protected fetchPaths(dayIndex: number): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.tripId) return reject(new Error('No trip ID'));
      let paths: Paths[] = this.paths.get(this.tripId) || [];
      if (paths[dayIndex]) return resolve();
      const trip = this.trips.get(this.tripId);
      if (!trip) return reject(new Error('No trip'));
      const day = trip.days[dayIndex];
      this.fetch('/directions/path', {
        method: 'POST',
        body: JSON.stringify(this.getWayPoints(day.itinerary)),
      })
        .then(response => response.json())
        .then(({ data }) => {
          paths[dayIndex] = data.path;
          this.paths.set(this.tripId as TripId, paths);
          resolve();
        });
    });
  }
  protected fetchPlaces(placeIds: PlaceId[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const list: PlaceId[] = placeIds.filter(id => !this.places.has(id));
      if (!list.length) return resolve();
      if (list.length === 1) {
        this.fetch('/places/' + list[0])
          .then(response => response.json())
          .then(({ data }) => {
            this.addPlace(data.place);
            return resolve();
          });
      }
      this.fetch('/places?ids=' + list.join('|'))
        .then(response => response.json())
        .then(({ data }) => {
          data.places.forEach((place: Place) => this.addPlace(place));
          return resolve();
        });
    });
  }
  protected fetchTripList(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.tripList) return resolve();
      this.fetch('/trips/list')
        .then(response => response.json())
        .then(({ data }) => {
          if (!data?.trips) reject(new Error('No trips'));
          this.tripList = data.trips;
          resolve();
        });
    });
  }
  protected fetchTrip(tripId: TripId): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!tripId) return reject('No trip ID');
      const trip = this.trips.get(tripId);
      if (trip) return resolve();
      this.fetch('/trips/' + tripId)
        .then(response => response.json())
        .then(({ data }) => {
          if (!data?.trip) return reject(new Error('No trip'));
          this.trips.set(tripId, data.trip);
          return this.fetchPlaces(data.trip.destinations);
        })
        .then(() => resolve());
    });
  }
  protected fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.user) return resolve();
      this.fetch('/user/info')
        .then(response => response.json())
        .then(({ data }) => {
          if (!data?.user) return reject(new Error('No user'));
          this.user = data.user;
          resolve();
        });
    });
  }
  protected getPaths(dayIndex: number): Promise<Paths> {
    return new Promise((resolve, reject) => {
      this.fetchPaths(dayIndex)
        .then(() => {
          const paths: Paths[] = this.paths.get(this.tripId || '') || [];
          resolve(paths[dayIndex]);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  protected getPlaces(placeIds: PlaceId[]): Promise<Places> {
    return new Promise((resolve, reject) => {
      this.fetchPlaces(placeIds)
        .then(() =>
          resolve(
            placeIds
              .map(id => this.places.get(id))
              .filter(place => place) as Places
          )
        )
        .catch(error => {
          reject(error);
        });
    });
  }
  protected getWayPoints(itinerary: Itinerary): WayPoint[] {
    let origin: Loc;
    return itinerary.reduce(
      (wayPoints: WayPoint[], { place_id }, index: number) => {
        const place = this.places.get(place_id) as Place;
        const destination = place?.location;
        if (index) {
          const wayPoint: WayPoint = {
            arrive_at: null,
            avoid: [],
            depart_at: null,
            origin,
            destination,
            modes: null,
            waypoints: [],
          };
          wayPoints.push(wayPoint);
        }
        origin = destination;
        return wayPoints;
      },
      []
    );
  }
  login(credentials: Credentials): Promise<Tokens> {
    return new Promise((resolve, reject) => {
      this.fetch(AUTH_URL, {
        method: 'POST',
        body: JSON.stringify({ ...AUTH_BODY, ...credentials }),
        headers: AUTH_HEADERS,
      })
        .then(response => response.json())
        .then(tokens => {
          if (!tokens) throw new Error('No tokens');
          this.tokens = tokens;
          resolve(tokens);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getTripList(): Promise<TripList> {
    return new Promise((resolve, reject) => {
      this.fetchTripList()
        .then(() => {
          if (!this.tripList) return reject(new Error('No trip list'));
          resolve(this.tripList);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      this.fetchUser()
        .then(() => {
          resolve(this.user as User);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  selectDay(
    dayIndex: number
  ): Promise<[TripDay, () => Promise<Places>, () => Promise<Paths>]> {
    return new Promise((resolve, reject) => {
      if (!dayIndex && dayIndex !== 0) return reject('No day index');
      if (!this.tripId) return reject('No trip');
      const trip = this.trips.get(this.tripId);
      if (!trip) return reject('No trip');
      const day = trip.days[dayIndex];
      const places = () =>
        this.getPlaces(day.itinerary.map(({ place_id }) => place_id));
      const paths = () => this.getPaths(dayIndex);
      resolve([day, places, paths]);
    });
  }
  selectTrip(tripId: TripId): Promise<Trip> {
    return new Promise((resolve, reject) => {
      this.fetchTrip(tripId)
        .then(() => {
          this.tripId = tripId;
          return resolve(this.trips.get(tripId) as Trip);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}
