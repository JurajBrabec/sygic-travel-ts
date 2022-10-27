import { SygicTravelAPI } from '../src';

describe('SygicTravel API', () => {
  const travel = new SygicTravelAPI({
    access_token: '',
    refresh_token: '',
  });
  it('should return trip list', () => {
    const result = travel.getTrips();
    expect(result).toEqual([]);
  });
  it('should return user details', () => {
    const result = travel.getTrips();
    expect(result).toEqual([]);
  });
});
