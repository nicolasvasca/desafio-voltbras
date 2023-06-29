import { Recharge } from '../../../src/domain/models/recharge.entity';
import MockStation from './mock-station';
import MockUser from './mock-user';

export default class MockRecharge {
  static mockRecharge(): Recharge {
    const recharge = new Recharge();
    recharge.station = MockStation.mockStation();
    recharge.user = MockUser.mockUser();
    recharge.id = '1';
    recharge.started = new Date();
    recharge.finished = new Date(recharge.started.getTime() + 60 * 60 * 1000);
    return recharge;
  }
}
