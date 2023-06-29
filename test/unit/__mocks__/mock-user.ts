import { User } from '../../../src/domain/models/user.entity';

export default class MockUser {
  static giveAMeAValidUser(): User {
    const user = new User();
    user.email = 'valid@email.com';
    user.name = 'Angelo Luz';
    user.id = '1';
    return user;
  }
}
