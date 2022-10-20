import { SygicTravelHAR } from '../src';
import fs from 'fs';

describe('SygicTravel HAR', () => {
  const HAR = fs.readFileSync('c:/users/juraj/downloads/demo.har', {
    encoding: 'utf8',
  });
  const travel = new SygicTravelHAR();
  travel.read(HAR);
  it('should return user details', () => {
    const result = travel.getUser();
    expect(result).toEqual(null);
  });
  it('should return trip list', () => {
    const result = travel.getTripList();
    expect(result).toEqual(null);
  });
  it('should return trip', () => {
    const result = travel.selectTrip('');
    expect(result).toEqual(null);
  });
});
