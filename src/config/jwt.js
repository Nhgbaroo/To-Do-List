module.exports = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || 'access-secret-key',
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || 'refresh-secret-key',
  ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES_IN || '15m',
  REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d',
  // Dùng cho cookie maxAge đồng bộ với REFRESH_TOKEN_EXPIRES (7 ngày)
  REFRESH_TOKEN_EXPIRES_MS: 7 * 24 * 60 * 60 * 1000
}
