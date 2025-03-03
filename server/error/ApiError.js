class ApiError extends Error {
  constructor(status, message, details = null) {
    super(message); // Сообщение об ошибке
    this.status = status; // HTTP-статус ошибки
    this.details = details; // Дополнительная информация об ошибке
  }

  /**
   * Создает ошибку 400 (Bad Request).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static badRequest(message, details = null) {
    return new ApiError(400, message, details);
  }

  /**
   * Создает ошибку 401 (Unauthorized).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static unauthorized(message = 'User unauthorazion', details = null) {
    return new ApiError(401, message, details);
  }

  /**
   * Создает ошибку 403 (Forbidden).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static forbidden(message, details = null) {
    return new ApiError(403, message, details);
  }

  /**
   * Создает ошибку 404 (Not Found).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static notFound(message, details = null) {
    return new ApiError(404, message, details);
  }

  /**
   * Создает ошибку 409 (Conflict).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static conflict(message, details = null) {
    return new ApiError(409, message, details);
  }

  /**
   * Создает ошибку 500 (Internal Server Error).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static internal(message, details = null) {
    return new ApiError(500, message, details);
  }

  /**
   * Создает ошибку 501 (Not Implemented).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static notImplemented(message, details = null) {
    return new ApiError(501, message, details);
  }

  /**
   * Создает ошибку 503 (Service Unavailable).
   * @param {string} message - Сообщение об ошибке.
   * @param {object | null} details - Детали ошибки.
   * @returns {ApiError}
   */
  static serviceUnavailable(message, details = null) {
    return new ApiError(503, message, details);
  }

  static validateNotEmptyObject(obj, errorMessage = "Object request", details = {}) {
    if (!obj || (typeof obj === "object" && Object.keys(obj).length === 0)) {
      throw ApiError.badRequest(errorMessage, details);
    }
  }
}

module.exports = ApiError;
