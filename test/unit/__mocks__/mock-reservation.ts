import { Reservation } from '../../../src/domain/models/reservation.entity';
import MockRecharge from './mock-recharge';
import MockStation from './mock-station';
import MockUser from './mock-user';

export default class MockReservation {
  static mockReservation(): Reservation {
    const reservation = new Reservation();
    reservation.station = MockStation.mockStation();
    reservation.user = MockUser.mockUser();
    reservation.recharge = MockRecharge.mockRecharge();
    reservation.id = '1';
    const currentDate = new Date();
    reservation.started = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate() + 1,
    );
    reservation.finished = new Date(
      reservation.started.getTime() + 60 * 60 * 1000,
    );
    return reservation;
  }
}
