interface ISygicTravel {
  paths: Map<TripId, Paths[]>;
  places: Map<PlaceId, Place>;
  tripId: TripId | null;
  tripList: TripList | null;
  trips: Map<TripId, Trip>;
  user: User | null;
  getTripList(): Promise<TripList>;
  getUser(): Promise<User>;
  selectDay(
    dayIndex: number
  ): Promise<[TripDay, () => Promise<Places>, () => Promise<Paths>]>;
  selectTrip(tripId: TripId): Promise<Trip>;
}

interface ISygicTravelHAR extends ISygicTravel {
  entries: HAREntries | null;
  read(HAR: string): Promise<void>;
}

interface ISygicTravelAPI extends ISygicTravel {
  tokens: Tokens | null;
  login(credentials: Credentials): Promise<Tokens | null>;
}
