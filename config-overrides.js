module.exports = function override(config) {
  config.resolve.fallback = {
    http: false,
    https: false,
  };
  return config;
};
