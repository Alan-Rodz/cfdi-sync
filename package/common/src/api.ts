export type ApiResponse<T = null> = {
 data?: T;
 message: string;
 token?: string;
}
