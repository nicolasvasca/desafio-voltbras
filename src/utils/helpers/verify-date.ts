export default class VerifyDate {
  static isAValidDateToReservation(date, dateToValid) {
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
}
