import { Reservation } from '../../domain/models/reservation.entity';

export default class VerifyDate {
  static isAValidDateToReservation(date: Date, dateToValid: Date) {
    if (dateToValid < date) {
      return false;
    }
    if (
      date.getDate() === dateToValid.getDate() &&
      date.getMonth() === dateToValid.getMonth() &&
      date.getFullYear() === dateToValid.getFullYear()
    ) {
      return false;
    }
    return true;
  }
  static isAValidReservationDate(date: Date, reservation: Reservation) {
    if (reservation.finished < date) {
      return false;
    }
    if (reservation.started > date) {
      return false;
    }
    return true;
  }
}
