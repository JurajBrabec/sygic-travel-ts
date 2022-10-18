import { SygicTravelHAR } from '../src';

describe('SygicTravel HAR', () => {
  const travel = new SygicTravelHAR();
  it('should return trip list', () => {
    const result = travel.getTrips();
    expect(result).toEqual(null);
  });
  it('should return user details', () => {
    const result = travel.getUser();
    expect(result).toEqual(null);
  });
});
