require("dotenv").config();

// to fetch and parse the product IDs from .env file and return them to the middlewares.
exports.product_ids = () => {
    const ids = JSON.parse(process.env.PRODUCT_IDS)
    return ids
}