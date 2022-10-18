export default class SygicTravel implements ISygicTravel {
  error: string | null;
  constructor() {
    this.error = null;
  }
  getTrips(): Trip[] | null {
    console.log('SygicTravel');
    return null;
  }
  getUser(): User | null {
    return null;
  }
}
