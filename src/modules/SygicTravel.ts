export default class SygicTravel implements ISygicTravel {
  places: [];
  routes: [];
  tripId: string | null;
  tripList: TripList | null;
  user: User | null;
  constructor() {
    this.places = [];
    this.routes = [];
    this.tripId = null;
    this.tripList = null;
    this.user = null;
  }
  selectDay(dayIndex: number): Promise<[TripDay]> {
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
