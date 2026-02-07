#!/usr/bin/env node

// Project's setup

import { citiesCommand } from "#commands/cities";
import { guideCommand } from "#commands/guide";
import { timesCommand } from "#commands/times";
import { Command } from "commander";

import pkg from "../package.json" with { type: "json" };

const program = new Command();

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .addCommand(timesCommand, { isDefault: true })
  .addCommand(guideCommand)
  .addCommand(citiesCommand);

program.parse();
