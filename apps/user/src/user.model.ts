import {
  BeforeCreate,
  Column,
  DataType,
  Model,
  Table
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';
import { GENDER, PROVIDER, ROLE } from '@app/shared';

@Table({ tableName: 'Users' })
export class UserModel extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true
  })
  id: string;

  @Column({ allowNull: false, type: DataType.STRING, unique: true })
  email: string;

  @Column({ allowNull: false, type: DataType.STRING })
  password: string;

  @Column({ type: DataType.STRING })
  fullName: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: GENDER.MALE,
    allowNull: false
  })
  gender: GENDER;

  @Column({
    type: DataType.INTEGER,
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
    type: DataType.ARRAY(DataType.INTEGER),
    defaultValue: [ROLE.USER],
    allowNull: false
  })
  roles: ROLE[];

  // Hooks for password hashing
  @BeforeCreate
  static async hashPassword(user: UserModel) {
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
