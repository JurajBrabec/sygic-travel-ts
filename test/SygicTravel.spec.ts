import SygicTravel from '../src/modules/SygicTravel';

describe('Sygic Travel', () => {
  const travel = new SygicTravel();
  it('should return trip list', () => {
    const result = travel.getTrips();
    expect(result).toEqual(null);
  });
  it('should return user details', () => {
    const result = travel.getUser();
    expect(result).toEqual(null);
  });
});
