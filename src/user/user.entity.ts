export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserEntity) {
    Object.assign(this, user);
  }
}
