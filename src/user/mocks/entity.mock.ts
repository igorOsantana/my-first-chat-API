import { UserEntity } from '../user.entity';

export class UserEntityMock {
  static create(userProps?: Partial<UserEntity>) {
    return new UserEntity({
      id: 'anyUserId',
      name: 'any user name',
      email: 'anyuser@mail.com',
      password: 'anyPassword',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...userProps,
    });
  }
}
