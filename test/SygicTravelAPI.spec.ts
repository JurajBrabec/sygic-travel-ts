import sygicTravel from '../src/index';

describe('SygicTravel API', () => {
  const travel = new sygicTravel.API({
    access_token: '',
    refresh_token: '',
  });
  it('should return trip list', () => {
    const result = travel.getTripList();
    expect(result).toEqual([]);
  });
  it('should return user details', () => {
    const result = travel.getUser();
    expect(result).toEqual([]);
  });
});
