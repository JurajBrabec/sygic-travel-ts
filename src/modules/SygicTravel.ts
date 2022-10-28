const MARKERS_URL = 'https://cdn.travel.sygic.com/web/markers/';

export default class SygicTravel implements ISygicTravel {
  paths: Map<TripId, Paths[]>;
  places: Map<PlaceId, Place>;
  tripId: TripId | null;
  tripList: TripList | null;
  trips: Map<TripId, Trip>;
  user: User | null;
  constructor() {
    this.paths = new Map();
    this.places = new Map();
    this.tripId = null;
    this.tripList = null;
    this.trips = new Map();
    this.user = null;
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
  protected fetchUser(): Promise<void> {
    this.user = null;
    return Promise.resolve();
  }
  protected fetchTripList(): Promise<void> {
    this.tripList = null;
    return Promise.resolve();
  }
  protected fetchTrip(tripId: TripId): Promise<void> {
    this.tripId = null;
    this.trips = new Map();
    return Promise.resolve();
  }
  selectDay(
    dayIndex: number
  ): Promise<[TripDay, () => Promise<Places>, () => Promise<Paths>]> {
    return Promise.reject(new Error('not implemented'));
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
          if (!this.user) return reject(new Error('No user'));
          resolve(this.user);
        })
        .catch(error => {
          reject(error);
        });
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
