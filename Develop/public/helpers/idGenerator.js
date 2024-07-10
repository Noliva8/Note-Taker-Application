const ShortUniqueId = require('short-unique-id');

// Initialize ShortUniqueId instance with length 4
const uid = new ShortUniqueId({ length: 4 });

// Export a function to generate a new unique ID
function generateUniqueId() {
    return uid.randomUUID();
}

module.exports = generateUniqueId;
