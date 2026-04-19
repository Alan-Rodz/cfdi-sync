// ********************************************************************************
// == Content Type ================================================================
export const RequestContentType = {
 Json: 'application/json',
 UrlEncoded: 'application/x-www-form-urlencoded',
 XML: 'application/xml',
} as const;
export type RequestContentType = typeof RequestContentType[keyof typeof RequestContentType];

// == Header ======================================================================
export const RequestHeader = {
 Authorization: 'Authorization',
 ContentDisposition: 'Content-Disposition',
 ContentType: 'Content-Type',
 Cookie: 'Set-Cookie',
 CypressTest: 'Cypress-Test',
 FBSignature: 'X-Hub-Signature-256',
 Host: 'Host',
 Origin: 'Origin',
 Protocol: 'X-Forwarded-Proto',
 STSignature: 'Stripe-Signature',
 SupabaseAccessToken: 'X-Supabase-Access-Token',
 UserAgent: 'User-Agent',
} as const;
export type RequestHeader = typeof RequestHeader[keyof typeof RequestHeader];

// == Request =====================================================================
export const RequestMethod = {
 DELETE: 'DELETE',
 GET: 'GET',
 HEAD: 'HEAD',
 OPTIONS: 'OPTIONS',
 PATCH: 'PATCH',
 POST: 'POST',
 PUT: 'PUT',
} as const;
export type RequestMethod = typeof RequestMethod[keyof typeof RequestMethod];
