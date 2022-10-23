export default class SygicTravel implements ISygicTravel {
  paths: Map<TripId, Paths[]>;
  places: Map<PlaceId, Place>;
  tripId: TripId | null;
  tripList: TripList | null;
  user: User | null;
  constructor() {
    this.paths = new Map();
    this.places = new Map();
    this.tripId = null;
    this.tripList = null;
    this.user = null;
  }
  selectDay(
    dayIndex: number
  ): Promise<[TripDay, Promise<Places>, Promise<Paths>]> {
    return Promise.reject(new Error('not implemented'));
  }
  getTripList(): Promise<TripList> {
    return Promise.reject(new Error('not implemented'));
  }
  selectTrip(tripId: string): Promise<Trip> {
    return Promise.reject(new Error('not implemented'));
  }
  getUser(): Promise<User> {
    return Promise.reject(new Error('not implemented'));
  }
}
