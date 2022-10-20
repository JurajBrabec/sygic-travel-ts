import SygicTravel from './SygicTravel';

export default class SygicTravelAPI
  extends SygicTravel
  implements ISygicTravelAPI
{
  credentials: Credentials | null;
  keys: ApiKeys | null;
  constructor(options?: ApiKeys) {
    super();
    this.credentials = null;
    this.keys = null;
    if (options) {
      this.keys = options;
    }
  }
  async login(credentials: Credentials) {
    this.credentials = credentials;
    const keys: ApiKeys = { apiKey: '', refreshKey: '' };
    this.keys = keys;
    return keys;
  }
  getTripList(): Promise<TripList> {
    return super.getTripList();
  }
  getUser(): Promise<User> {
    return super.getUser();
  }
  selectDay(dayIndex: number): Promise<[TripDay]> {
    return super.selectDay(dayIndex);
  }
  selectTrip(tripId: string): Promise<Trip> {
    return super.selectTrip(tripId);
  }
}
