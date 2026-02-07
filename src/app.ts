#!/usr/bin/env node


import { citiesCommand } from "#commands/cities";
import { guideCommand } from "#commands/guide";
import { timesCommand } from "#commands/times";
import { Command } from "commander";

const program = new Command();

program
  .name("salat")
  .description("Daily Moroccan prayers time, right in your console")
  .version("4.4.0")
  .addCommand(timesCommand, { isDefault: true })
  .addCommand(guideCommand)
  .addCommand(citiesCommand);

program.parse();
