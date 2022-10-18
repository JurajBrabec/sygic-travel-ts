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
  getTrips(): Trip[] | null {
    console.log('SygicTravel API');
    return [];
  }
  getUser(): User | null {
    console.log('SygicTravel API');
    return { name: '' };
  }
}
