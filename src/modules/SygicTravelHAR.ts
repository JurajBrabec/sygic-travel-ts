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
          new RegExp('application/json').test(response.content.mimeType)
      );
      resolve();
    });
  }
  selectDay(dayIndex: number): Promise<[TripDay]> {
    return new Promise((resolve, reject) => {
      if (!this.tripId) return reject(new Error('No trip'));
      this.selectTrip(this.tripId)
        .then(trip => {
          resolve([trip.days[dayIndex]]);
        })
        .catch(error => reject(error));
    });
  }

  private getTripId(): string | null {
    if (!this.tripId) {
      if (!this.entries) throw new Error('No entries');
      const entry: HAREntry | undefined = this.entries
        .filter(({ request }) => new RegExp('trips/').test(request.url))
        .filter(({ request }) => !new RegExp('/list?').test(request.url))
        .pop();
      if (!entry) throw new Error('No trip');
      this.tripId = entry.request.url.split('/').pop() || '';
    }
    return this.tripId;
  }
  getTripList(): Promise<TripList> {
    return new Promise((resolve, reject) => {
      if (!this.tripList) {
        if (!this.entries) return reject(new Error('No entries'));
        const tripList: TripList = this.entries
          .filter(({ request }) => new RegExp('trips/list?').test(request.url))
          .map(({ response }) => JSON.parse(response.content.text).data.trips)
          .pop();
        if (!tripList) return reject(new Error('No trip list'));
        this.tripList = tripList.filter(({ id }) => id === this.getTripId());
      }
      resolve(this.tripList);
    });
  }
  selectTrip(tripId: string): Promise<Trip> {
    return new Promise((resolve, reject) => {
      if (!this.entries) return reject(new Error('No entries'));
      if (!tripId) return reject(new Error('No trip ID'));
      const trip: Trip = this.entries
        ?.filter(({ request }) =>
          new RegExp(`trips/${tripId}`).test(request.url)
        )
        .map(({ response }) => JSON.parse(response.content.text).data.trip)
        .pop();
      if (!trip) return reject(new Error('No trip'));
      this.tripId = tripId;
      resolve(trip);
    });
  }
  getUser(): Promise<User> {
    return new Promise((resolve, reject) => {
      if (!this.user) {
        if (!this.entries) return reject(new Error('No entries'));
        this.user = this.entries
          ?.filter(({ request }) => new RegExp('/user/info').test(request.url))
          .map(({ response }) => JSON.parse(response.content.text).data.user)
          .pop();
      }
      this.user ? resolve(this.user) : reject(new Error('No user'));
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
  .then(([day]) => {
    day.itinerary.map(i => console.log(i));
  })
  .catch(error => {
    console.error('Error: ', error);
  });
