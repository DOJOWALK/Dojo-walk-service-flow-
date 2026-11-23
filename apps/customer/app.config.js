module.exports = ({ config }) => {
  const plugins = [...(config.plugins ?? [])];

  // Supply GOOGLE_MAPS_API_KEY through EAS environment secrets for release builds.
  if (process.env.GOOGLE_MAPS_API_KEY) {
    plugins.push([
      "react-native-maps",
      { androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY },
    ]);
  }

  return { ...config, plugins };
};
