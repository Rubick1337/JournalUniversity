const db = require("./db");
const ApiError = require("./error/ApiError");

async function dbQuery(query, params = []) {
    try {
        const result = await db.query(query, { bind: params, type: db.QueryTypes.SELECT });
        return result;
    } catch (err) {
        console.error("DB query failed:", err.message, err.stack);
        throw ApiError.internal(`Ошибка выполнения запроса к базе данных: ${err.message}`);
    }
}


module.exports = { dbQuery };
