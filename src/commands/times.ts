import { QueryProvider } from "#components/QueryProvider";
import App from "#components/TimesApp";
import { Command } from "commander";
import { render } from "ink";
import React from "react";

export const timesCommand = new Command("times")
  .description("Get prayer times for a city")
  .argument("[city]", "City name")
  .option("-1, --once", "Run once and exit", false)
  .action((city, options) => {
    render(
      React.createElement(
        QueryProvider,
        undefined,
        React.createElement(App, { cityNameArg: city, once: options.once }),
      ),
    );
  });
