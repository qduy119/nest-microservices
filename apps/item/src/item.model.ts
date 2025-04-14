import {
  Table,
  Column,
  Model,
  PrimaryKey,
  AutoIncrement,
  DataType,
  AllowNull,
  Default
} from 'sequelize-typescript';

@Table({ tableName: 'Items' })
export class ItemModel extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @AllowNull(false)
  @Column(DataType.STRING)
  thumbnail: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  name: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  description: string;

  @AllowNull(false)
  @Column(DataType.FLOAT)
  price: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  discount: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  stock: number;

  @AllowNull(false)
  @Column(DataType.ARRAY(DataType.TEXT))
  images: string[];

  @AllowNull(false)
  @Default(0)
  @Column(DataType.FLOAT)
  rating: number;
}
