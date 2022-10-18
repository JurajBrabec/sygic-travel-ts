type Credentials = {
  userName: string;
  password: string;
};
type ApiKeys = {
  apiKey: string;
  refreshKey: string;
};
type Trip = {
  id: string;
  name: string;
};

type User = {
  name: string;
};

interface ISygicTravel {
  error: string | null;
  getTrips(): Trip[] | null;
  getUser(): User | null;
}

interface ISygicTravelHAR extends ISygicTravel {
  fileName: string | null;
  open(fileName: string): void;
}

interface ISygicTravelAPI extends ISygicTravel {
  credentials: Credentials | null;
  keys: ApiKeys | null;
  login(credentials: Credentials): Promise<ApiKeys | null>;
}
