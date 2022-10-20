export default class SygicTravel implements ISygicTravel {
  places: Map<string, Place>;
  routes: [];
  tripId: string | null;
  tripList: TripList | null;
  user: User | null;
  constructor() {
    this.places = new Map();
    this.routes = [];
    this.tripId = null;
    this.tripList = null;
    this.user = null;
  }
  selectDay(dayIndex: number): Promise<[TripDay, Promise<Places>]> {
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
