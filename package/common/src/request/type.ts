// ********************************************************************************
// == Content Type ================================================================
export enum RequestContentType {
 Json = 'application/json',
 UrlEncoded = 'application/x-www-form-urlencoded',
 XML = 'application/xml',
}

// == Header ======================================================================
export enum RequestHeader {
 Authorization = 'Authorization',
 ContentDisposition = 'Content-Disposition',
 ContentType = 'Content-Type',
 Cookie = 'Set-Cookie',
 CypressTest = 'Cypress-Test',
 FBSignature = 'X-Hub-Signature-256',
 Host = 'Host',
 Origin = 'Origin',
 Protocol = 'X-Forwarded-Proto',
 STSignature = 'Stripe-Signature',
 UserAgent = 'User-Agent',
}

// == Request =====================================================================
export enum RequestMethod {
 DELETE = 'DELETE',
 GET = 'GET',
 HEAD = 'HEAD',
 PATCH = 'PATCH',
 POST = 'POST',
 PUT = 'PUT',
}
