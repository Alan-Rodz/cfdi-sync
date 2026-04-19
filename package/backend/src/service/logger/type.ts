// ********************************************************************************
export type LoggerContext = Record<string, unknown>;

export type LoggerLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

export type LoggerServiceConfig = {
 includeTimestamp?: boolean;
 scope?: string;
};

export type LoggerLogOptions = {
 context?: LoggerContext;
 scope?: string;
};

export type LoggerPort = {
 info(message: string, options?: LoggerLogOptions): Promise<void>;
 safeLogError(message: string, error: unknown): Promise<void>;
};
