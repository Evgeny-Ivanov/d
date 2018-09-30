const rewireMobX = require('react-app-rewire-mobx');

module.exports = function override(config, env) {
  config = rewireMobX(config, env);
  config.module.rules.push({
    test: /\.js$/,
    use: 'ify-loader'
  });

  return config;
};