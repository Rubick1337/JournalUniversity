const ApiError = require("../error/ApiError");
const TokenService = require("../services/TokenService");

const getAuthTokenFromHeaders = (req) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer ")) {
        throw ApiError.unauthorized("Authorization token is missing or invalid");
    }
    const valueAuthToken = authToken.split(" ")[1];
    return TokenService.validateAccessToken(valueAuthToken);
};

module.exports = async function (req, res, next) {
    try {
        const data = getAuthTokenFromHeaders(req);

        if (!data) {
            return next(ApiError.unauthorized("Invalid or expired token"));
        }

        req.userIdFromToken = data.id;
        req.roleIdFromToken = data.roleId;
        //Обновляем токены...
        const tokens = await TokenService.getTokenForUser({id: data.id, role_id: data.roleId});
        TokenService.saveTokenInRequest(tokens.refreshToken,res)
        next();
    } catch (err) {
        console.error("ERROR in AuthMiddleware:", err);
        return next(err instanceof ApiError ? err : ApiError.unauthorized("An error occurred during token validation", err));
    }
};
