module.exports = (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // from the root of the project (folder with cypress.json file)
  config.env.webpackFilename = '.webpack/webpack.dev.js';
  // and disable code coverage
  config.env.coverage = false;
  require('@cypress/react/plugins/load-webpack')(on, config);

  // IMPORTANT to return the config object
  // with the any changed environment variables
  return config;
};