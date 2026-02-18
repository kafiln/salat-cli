import TimesCommandWrapper from "#components/TimesCommandWrapper";
import { Command } from "commander";
import { render } from "ink";
import React from "react";

export const timesCommand = new Command("times")
  .description("Get prayer times for a city")
  .argument("[city]", "City name")
  .option("-1, --once", "Run once and exit", false)
  .action((city, options) => {
    render(
      React.createElement(TimesCommandWrapper, {
        initialCity: city,
        once: options.once,
      }),
    );
  });
