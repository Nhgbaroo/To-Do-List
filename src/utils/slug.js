/**
 * Tạo slug từ text: bỏ dấu tiếng Việt, thay khoảng trắng bằng dấu -
 * @param {string} text
 * @returns {string}
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')                    // tách dấu ra khỏi chữ: ă → ă
    .replace(/[\u0300-\u036f]/g, '')     // xoá dấu: ă → a
    .replace(/đ/g, 'd')                  // đ → d
    .replace(/[^a-z0-9\s-]/g, '')        // xoá ký tự đặc biệt
    .replace(/\s+/g, '-')                // khoảng trắng → dấu -
    .replace(/-+/g, '-')                 // nhiều dấu - liên tiếp → 1 dấu -
    .replace(/^-|-$/g, '')               // bỏ dấu - ở đầu/cuối
}

module.exports = { generateSlug }
