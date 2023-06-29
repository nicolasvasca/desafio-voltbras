import { Planet } from '../../../src/domain/models/planet.entity';

export default class MockPlanet {
  static mockPlanet(): Planet {
    const planet = new Planet();
    planet.mass = 27;
    planet.name = 'nu Oph c';
    planet.id = '1';
    planet.hasStation = false;
    return planet;
  }
}
