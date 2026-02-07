import HelpApp from "#components/HelpApp";
import { Command } from "commander";
import { render } from "ink";
import React from "react";

export const guideCommand = new Command("guide")
  .description("Show a rich visual guide to using salat-cli")
  .option("-1, --once", "Run once and exit", false)
  .action(() => {
    render(React.createElement(HelpApp));
  });
