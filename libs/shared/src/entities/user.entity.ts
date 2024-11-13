import {
  AllowNull,
  BeforeCreate,
  Column,
  DataType,
  Default,
  Model,
  PrimaryKey,
  Table
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { GENDER, PROVIDER, ROLE } from '../constants';

@Table({ tableName: 'Users' })
export class User extends Model<User> {
  @PrimaryKey
  @Default(() => randomUUID())
  @Column(DataType.UUID)
  @AllowNull(false)
  id: string;

  @Column({ allowNull: false })
  email: string;

  password: string;

  fullName: string;

  @Column({
    type: DataType.ENUM(...Object.values(GENDER)),
    defaultValue: GENDER.MALE,
    allowNull: false
  })
  gender: GENDER;

  @Column({
    type: DataType.ENUM(...Object.values(PROVIDER)),
    defaultValue: PROVIDER.LOCAL,
    allowNull: false
  })
  provider: PROVIDER;

  @Column({
    type: DataType.TEXT,
    defaultValue:
      'https://res.cloudinary.com/dlzyiprib/image/upload/v1694617729/e-commerces/user/kumz90hy8ufomdgof8ik.jpg',
    allowNull: false
  })
  avatar: string;

  @Column({
    type: DataType.ARRAY(DataType.ENUM(...Object.values(ROLE))),
    defaultValue: [ROLE.USER],
    allowNull: false
  })
  roles: ROLE[];

  // Hooks for password hashing
  @BeforeCreate
  static async hashPassword(user: User) {
    if (user.password) {
      const salt = await bcrypt.genSalt(16);
      user.password = await bcrypt.hash(user.password, salt);
    }
  }

  // Method to check if the password is correct
  isCorrectedPassword(password: string): Promise<boolean> {
    if (password && this.password) {
      return bcrypt.compare(password, this.password);
    }
    return Promise.resolve(false);
  }
}
