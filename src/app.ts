#!/usr/bin/env node

// Project's dependencies
import { render } from "ink";
import React from "react";
import App from "./ui.js"; // Note the .js extension for ESM imports

// Project's setup
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const args = process.argv;
const cityNameArg = args[2];

const main = () => {
  render(React.createElement(App, { cityNameArg }));
};

main();
