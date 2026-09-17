const LAN_API_URL = 'http://192.168.0.110';

export default ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    apiUrl: process.env.EXPO_PUBLIC_API_URL || LAN_API_URL,
  },
});
