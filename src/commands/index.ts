import { Command } from "../types/Command";
import verify from "./utility/verify";

interface Commands {
  [key: string]: Command;
}

export const commands: Commands = { verify };
