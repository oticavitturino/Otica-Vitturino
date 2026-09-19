const LAN_API_URL = 'http://129.121.54.46';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL || LAN_API_URL,
  },
});
