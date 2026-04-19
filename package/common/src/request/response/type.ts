// ********************************************************************************
export const ResponseStatus = {
 BAD_REQUEST: 400,
 CONFLICT: 409,
 CREATED: 201,
 ERROR: 500,
 FORBIDDEN: 403,
 METHOD_NOT_ALLOWED: 405,
 NOT_FOUND: 404,
 RATE_LIMIT_EXCEEDED: 429,
 SUCCESS: 200,
 UNAUTHORIZED: 401,
} as const;
export type ResponseStatus = typeof ResponseStatus[keyof typeof ResponseStatus];
