// import { DataTypes, Sequelize } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  Default,
  PrimaryKey,
  IsUUID,
  AllowNull,
  Index,
} from "sequelize-typescript";

@Table
export class Form extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uuid!: string;

  @Index
  @AllowNull(false)
  @Column(DataType.STRING)
  server_id!: string;

  @Column(DataType.STRING)
  name!: string;
}
