import { Client, Collection } from "discord.js";
import { Command } from "./Command";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

export class ExtendedClient extends Client {
  commands: Collection<string, Command>;

  constructor(options: any) {
    super(options);
    this.commands = new Collection<string, Command>();
  }
}
