// import { DataTypes, Sequelize } from "sequelize";

import {
  Table,
  Model,
  Column,
  DataType,
  Default,
  PrimaryKey,
  AllowNull,
  Index,
  HasMany,
} from "sequelize-typescript";
import { FormField } from "./FormField";

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

  @HasMany(() => FormField)
  fields!: FormField[];
}
