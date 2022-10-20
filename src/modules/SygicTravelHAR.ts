import SygicTravel from './SygicTravel';

export default class SygicTravelHAR
  extends SygicTravel
  implements ISygicTravelHAR
{
  fileName: string | null;
  entries: HAREntries | null;
  constructor() {
    super();
    this.fileName = null;
    this.entries = null;
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
      resolve();
    });
  }
  private getTripId(): void {
    this.tripId = this.entries
      ? this.entries
          .filter(({ request }) => request.url.includes('/trips/'))
          .filter(({ request }) => !request.url.includes('/trips/list?'))
          .pop()
          ?.request.url.split('/')
          .pop() || null
      : null;
  }
  private getPlaces(): void {
    if (this.entries)
      this.entries
        .filter(({ request }) => request.url.includes('/places?id'))
        .map(({ response }) => JSON.parse(response.content.text).data.places)
        .flat()
        .forEach(place => this.places.set(place.id, place));
  }
  getTripList(): Promise<TripList> {
    return new Promise((resolve, reject) => {
      if (!this.tripList) {
        if (!this.entries) return reject(new Error('No entries'));
        const tripList: TripList = this.entries
          .filter(({ request }) => request.url.includes('/trips/list?'))
          .map(({ response }) => JSON.parse(response.content.text).data.trips)
          .pop();
        if (!tripList) return reject(new Error('No trip list'));
        this.tripList = tripList.filter(({ id }) => id === this.tripId);
      }
      resolve(this.tripList);
    });
  }
  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!this.user) {
        if (!this.entries) return reject(new Error('No entries'));
        this.user = this.entries
          ?.filter(({ request }) => request.url.includes('/user/info'))
          .map(({ response }) => JSON.parse(response.content.text).data.user)
          .pop();
      }
      this.user ? resolve(this.user) : reject(new Error('No user'));
    });
  }
  selectDay(dayIndex: number): Promise<[TripDay, Promise<Places>]> {
    return new Promise((resolve, reject) => {
      if (!this.tripId) return reject(new Error('No trip'));
      this.selectTrip(this.tripId)
        .then(trip => {
          const day = trip.days[dayIndex];
          const placeIds = [...trip.destinations];
          const places: Promise<Places> = new Promise((resolve, reject) => {
            day.itinerary.forEach(({ place_id }) => placeIds.push(place_id));
            const result = placeIds
              .map(placeId => this.places.get(placeId))
              .filter(p => p);
            resolve(result as Places);
          });
          resolve([day, places]);
        })
        .catch(error => reject(error));
    });
  }
  selectTrip(tripId: string): Promise<Trip> {
    return new Promise((resolve, reject) => {
      if (!this.entries) return reject(new Error('No entries'));
      if (!tripId) return reject(new Error('No trip ID'));
      const trip: Trip = this.entries
        ?.filter(({ request }) => request.url.includes(`/trips/${tripId}`))
        .map(({ response }) => JSON.parse(response.content.text).data.trip)
        .pop();
      if (!trip) return reject(new Error('No trip'));
      this.tripId = tripId;
      resolve(trip);
    });
  }
}

import fs from 'fs';
const HAR = fs.readFileSync('c:/users/juraj/downloads/demo.har', {
  encoding: 'utf8',
});

const travel = new SygicTravelHAR();

travel
  .read(HAR)
  .then(() => travel.getTripList())
  .then(tripList => {
    console.log('trips', tripList);
    return travel.getUser();
  })
  .then(user => {
    console.log('user', user);
    return travel.selectTrip('62cc2df4954c4');
  })
  .then(trip => {
    console.log('trip', trip);
    return travel.selectDay(2);
  })
  .then(([day, places]) => {
    day.itinerary.map(i => console.log(i));
    places.then(console.log);
  })
  .catch(error => {
    console.error('Error: ', error);
  });
