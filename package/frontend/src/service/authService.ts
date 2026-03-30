import { apiServiceUrls } from "@/constant/serviceUrl";
import { AUTH_TOKEN_STORAGE_KEY, RequestContentType, RequestHeader, RequestMethod, userApiRoutes, type LoginData, type LoginResponseData, type RegisterUserData, type RegisterUserResponseData } from "@catenae/common";

// ********************************************************************************
// == Service =====================================================================
export const authService = {
 clearToken(): void { localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY); },

 getToken(): string | null { return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY); },

 async login(data: LoginData): Promise<LoginResponseData> {
  const { email, password } = data;

  const response = await fetch(`${apiServiceUrls.userServiceUrl}${userApiRoutes.prefix}${userApiRoutes.post.login}`, {
   method: RequestMethod.POST,
   headers: { [RequestHeader.ContentType]: RequestContentType.Json },
   body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error('Login failed');
  return response.json();
 },

 async signup(data: RegisterUserData): Promise<RegisterUserResponseData> {
  const { email, password, passwordConfirmation } = data;

  const response = await fetch(`${apiServiceUrls.userServiceUrl}${userApiRoutes.prefix}${userApiRoutes.post.register}`, {
   method: RequestMethod.POST,
   headers: { [RequestHeader.ContentType]: RequestContentType.Json },
   body: JSON.stringify({ email, password, passwordConfirmation }),
  });

  if (!response.ok) throw new Error('Registration failed');
  return response.json();
 },

 setToken(token: string): void { localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token); },
};
