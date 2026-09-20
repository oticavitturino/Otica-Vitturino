function configuredApiUrl() {
  const value = process.env.EXPO_PUBLIC_API_URL;
  return typeof value === 'string' ? value.trim() : '';
}

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: configuredApiUrl(),
  },
});
