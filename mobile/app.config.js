const DEFAULT_API_URL = 'https://www.vitturino.com.br,http://129.121.54.46';

function configuredApiUrl() {
  const value = process.env.EXPO_PUBLIC_API_URL;
  return typeof value === 'string' && value.trim() ? value.trim() : DEFAULT_API_URL;
}

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: configuredApiUrl(),
  },
});
