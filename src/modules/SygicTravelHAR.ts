import SygicTravel from './SygicTravel';

export default class SygicTravelHAR
  extends SygicTravel
  implements ISygicTravelHAR
{
  entries: HAREntries | null;
  constructor(HAR?: string) {
    super();
    this.entries = null;
  }
  protected fetchTripList(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.tripList) return resolve();
      if (!this.entries) return reject(new Error('No entries'));
      this.tripList = this.entries
        .filter(({ request }) => request.url.includes('/trips/list?'))
        .map(({ response }) => JSON.parse(response.content.text).data.trips)
        .pop()
        .filter((trip: Trip) => trip.id === this.tripId);
      return this.tripList ? resolve() : reject(new Error('No trip list'));
    });
  }
  protected fetchTrip(tripId: TripId): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.entries) return reject(new Error('No entries'));
      if (!tripId) return reject(new Error('No trip ID'));
      const trip: Trip = this.entries
        ?.filter(({ request }) => request.url.includes(`/trips/${tripId}`))
        .map(({ response }) => JSON.parse(response.content.text).data.trip)
        .pop();
      if (!trip) return reject(new Error('No trip'));
      this.tripId = tripId;
      this.trips.set(tripId, trip);
      resolve();
    });
  }

  protected fetchUser(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.user) return resolve();
      if (!this.entries) return reject(new Error('No entries'));
      this.user = this.entries
        ?.filter(({ request }) => request.url.includes('/user/info'))
        .map(({ response }) => JSON.parse(response.content.text).data.user)
        .pop();
      return this.user ? resolve() : reject(new Error('No user'));
    });
  }
  protected getTripId(): void {
    this.tripId = this.entries
      ? this.entries
          .filter(
            ({ request }) =>
              request.url.includes('/trips/') &&
              !request.url.includes('/trips/list?')
          )
          .pop()
          ?.request.url.split('/')
          .pop() || null
      : null;
  }
  protected getPlaces(): void {
    if (this.entries)
      this.entries
        .filter(({ request }) => request.url.includes('/places?id'))
        .map(({ response }) => JSON.parse(response.content.text).data.places)
        .flat()
        .forEach(place => this.addPlace(place));
  }
  protected getPaths(): void {
    if (this.entries && this.tripId) {
      this.paths.set(
        this.tripId,
        this.entries
          .filter(({ request }) => request.url.includes('/directions/path'))
          .map(({ response }) => JSON.parse(response.content.text).data.path)
      );
    }
  }
  read(HAR: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.entries = null;
      const har = JSON.parse(HAR);
      if (!har?.log?.entries) return reject(new Error('not a valid HAR'));
      this.entries = (har.log.entries as HAREntries).filter(
        ({ response }) =>
          response.status === 200 &&
          response.content.mimeType === 'application/json'
      );
      if (!this.entries) reject(new Error('No entries'));
      this.getTripId();
      this.getPlaces();
      this.getPaths();
      resolve();
    });
  }
  selectDay(
    dayIndex: number
  ): Promise<[TripDay, () => Promise<Places>, () => Promise<Paths>]> {
    return new Promise((resolve, reject) => {
      if (!this.tripId) return reject(new Error('No trip'));
      this.selectTrip(this.tripId)
        .then(trip => {
          const day = trip.days[dayIndex];
          const placeIds = [...trip.destinations];
          const places = (): Promise<Places> =>
            new Promise((resolve, reject) => {
              day.itinerary.forEach(({ place_id }) => placeIds.push(place_id));
              const result = placeIds
                .map(placeId => this.places.get(placeId))
                .filter(p => p);
              if (!result) return reject(new Error('No places'));
              resolve(result as Places);
            });
          const paths = (): Promise<Paths> =>
            new Promise((resolve, reject) => {
              const result = this.paths.get(this.tripId || '');
              if (!result) return reject(new Error('No paths'));
              resolve(result[dayIndex] as Paths);
            });
          resolve([day, places, paths]);
        })
        .catch(error => reject(error));
    });
  }
}
