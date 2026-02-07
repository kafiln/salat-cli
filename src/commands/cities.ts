import CitiesApp from "#components/CitiesApp";
import { Command } from "commander";
import { render } from "ink";
import React from "react";

export const citiesCommand = new Command("cities")
  .description("Display the list of available city names")
  .option("-1, --once", "Run once and exit", true) // Default to true for a static list
  .action(() => {
    // We always run this "once" because it's just a list
    render(React.createElement(CitiesApp));
  });
