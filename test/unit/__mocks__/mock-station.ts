import { Station } from '../../../src/domain/models/station.entity';
import MockPlanet from './mock-planet';

export default class MockStation {
  static mockStation(): Station {
    const station = new Station();
    station.planet = MockPlanet.mockPlanet();
    station.name = 'Station One';
    station.id = '1';
    station.createdAt = new Date();
    return station;
  }
}
