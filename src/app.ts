#!/usr/bin/env node

// Project's dependencies
import { render } from "ink";
import React from "react";
import App from "./ui.js"; // Note the .js extension for ESM imports

import { Command } from "commander";

// Project's setup
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const program = new Command();

program
  .name("salat")
  .description("Daily Moroccan prayers time, right in your console")
  .version("4.2.0")
  .argument("[city]", "City name")
  .option("-1, --once", "Run once and exit", false)
  .action((city, options) => {
    render(React.createElement(App, { cityNameArg: city, once: options.once }));
  });

program.parse();
