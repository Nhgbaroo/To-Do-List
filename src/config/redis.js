const Redis = require('ioredis')

const redisClient = new Redis(process.env.REDIS_URL || 'redis://localhost:6379')

redisClient.on('connect', () => {
    console.log('✅ Kết nối Redis thành công')
})

redisClient.on('error', (err) => {
    console.error('❌ Lỗi kết nối Redis:', err.message)
})

module.exports = redisClient