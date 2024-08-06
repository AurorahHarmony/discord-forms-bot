import { Sequelize } from "sequelize-typescript";
import { Form } from "./models/Form";

const sequelize = new Sequelize("registration_forms", "user", "password", {
  host: "localhost",
  dialect: "sqlite",
  logging: false,
  storage: "database.sqlite",
  models: [__dirname + "/models/*.model.ts"],
});

sequelize.addModels([Form]);

sequelize
  .sync()
  .then(async () => {})
  .catch(console.error);
