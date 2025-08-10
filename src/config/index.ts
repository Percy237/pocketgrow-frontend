const config = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  // Add other environment variables here as needed
  // ENV: import.meta.env.MODE || 'development',
  // SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
}

export default config
