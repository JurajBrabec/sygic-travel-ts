import SygicTravel from './SygicTravel';

export default class SygicTravelHAR
  extends SygicTravel
  implements ISygicTravelHAR
{
  fileName: string | null;
  constructor() {
    super();
    this.fileName = null;
  }
  open(fileName: string): void {
    this.fileName = fileName;
  }
  getTrips(): Trip[] | null {
    console.log('SygicTravel HAR');
    return [];
  }
  getUser(): User | null {
    console.log('SygicTravel HAR');
    return { name: '' };
  }
}
