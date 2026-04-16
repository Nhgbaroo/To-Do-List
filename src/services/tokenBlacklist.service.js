const redisClient = require('../config/redis')

const BLACKLIST_PREFIX = 'bl_'

/**
 * Thêm accessToken vào blacklist với TTL = thời gian còn lại của token
 * @param {string} token - Access token cần blacklist
 * @param {number} expTimestamp - Thời điểm hết hạn của token (exp từ JWT payload, đơn vị: giây)
 */

const addToBlacklist = async (token, expTimestamp) => {
    const now = Math.floor(Date.now() / 1000)
    const ttl = expTimestamp - now

    // Nếu token đã hết hạn thì không cần blacklist
    if (ttl <= 0) return

    // Lưu vào Redis với TTL tự động hết hạn
    await redisClient.set(`${BLACKLIST_PREFIX}${token}`, 'blacklisted', 'EX', ttl)
}

/**
 * Kiểm tra accessToken có bị blacklist hay không
 * @param {string} token - Access token cần kiểm tra
 * @returns {boolean} - true nếu token bị blacklist
 */

const isBlacklisted = async (token) => {
    const result = await redisClient.get(`${BLACKLIST_PREFIX}${token}`)
    return result !== null
}

module.exports = { addToBlacklist, isBlacklisted }