import HijriApp from "#components/HijriApp";
import { Command } from "commander";
import { render } from "ink";
import React from "react";

export const hijriCommand = new Command("hijri")
  .description("Display the hijri date")
  .option("-1, --once", "Run once and exit", false)
  .action(() => {
    render(React.createElement(HijriApp));
  });
