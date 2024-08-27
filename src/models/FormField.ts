import { TextInputStyle } from "discord.js";
import {
  AllowNull,
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { Form } from "./Form";

const TextInputStyleValues = Object.values(TextInputStyle).filter(
  (key) => typeof key === "string"
) as string[];

@Table
export class FormField extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  uuid!: string;

  @ForeignKey(() => Form)
  form_id!: string;

  @AllowNull(false)
  @Column(DataType.SMALLINT)
  position!: number;

  @BelongsTo(() => Form, "form_id")
  form!: Form;

  @AllowNull(false)
  @Column({
    type: DataType.ENUM(...TextInputStyleValues),
  })
  type!: TextInputStyle;

  @Column(DataType.STRING)
  placeholder!: string;

  // @BeforeCreate
  // static async assignPosition(instance: FormField): Promise<void> {
  //   const maxPosition = await FormField.max<number>("position", {
  //     where: { form_id: instance.form_id },
  //   });

  //   console.log(maxPosition);

  //   instance.position = (maxPosition || 0) + 1;
  // }
}
