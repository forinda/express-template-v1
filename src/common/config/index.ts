import { LoggerOptions, LogLevel } from '../logger';
import { autoBind } from '@/core/decorators/bind';
import { Singleton } from '@/core/di/container';
import 'dotenv/config';

export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  ssl: boolean;
}

export interface ServerConfig {
  port: number;
  host: string;
  cors: {
    origin: string | string[];
    methods: string[];
    allowedHeaders: string[];
  };
}

export interface SwaggerConfig {
  title: string;
  description: string;
  version: string;
  path: string;
}

export interface AppConfig {
  environment: 'development' | 'production' | 'test';
  logger: LoggerOptions;
  database: DatabaseConfig;
  server: ServerConfig;
  swagger: SwaggerConfig;
}

export interface DbConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
}

export interface CookieConfig {
  name: string;
  secret: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'strict' | 'lax' | 'none';
    maxAge: number;
  };
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
}

@autoBind()
@Singleton()
export class ConfigService {
  private config: AppConfig;
  private dbConfig: DbConfig;
  private serverConfig: ServerConfig;
  private cookieConfig: CookieConfig;
  private jwtConfig: JWTConfig;
  constructor() {
    this.config = this.loadConfig();
    this.dbConfig = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'di_decos',
    };
    this.serverConfig = {
      port: parseInt(process.env.PORT || '3000'),
      host: process.env.HOST || 'localhost',
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      },
    };

    this.cookieConfig = {
      name: process.env.COOKIE_NAME || 'auth_token',
      secret: process.env.COOKIE_SECRET || 'secret',
      options: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: parseInt(process.env.COOKIE_MAX_AGE || '3600000'), // 1 hour
      },
    };
    this.jwtConfig = {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    };
  }

  private loadConfig(): AppConfig {
    // In a real application, you would load this from environment variables or a config file
    return {
      environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
      logger: {
        level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
        format: 'simple',
        transports: ['console'],
        filename: 'logs/app.log',
        maxSize: 10 * 1024 * 1024,
        maxFiles: 5,
      },
      database: {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432', 10),
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'express_meta',
        ssl: process.env.DB_SSL === 'true',
      },
      server: {
        port: parseInt(process.env.PORT || '3000', 10),
        host: process.env.HOST || 'localhost',
        cors: {
          origin: process.env.CORS_ORIGIN || '*',
          methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization'],
        },
      },
      swagger: {
        title: 'Express Meta API',
        description: 'API documentation for Express Meta application',
        version: '1.0.0',
        path: '/api-docs',
      },
    };
  }

  get<T>(key: keyof AppConfig): T {
    return this.config[key] as T;
  }

  getLoggerConfig(): LoggerOptions {
    return this.config.logger;
  }

  getDatabaseConfig(): DatabaseConfig {
    return this.config.database;
  }

  getServerConfig(): ServerConfig {
    return this.serverConfig;
  }

  getSwaggerConfig(): SwaggerConfig {
    return this.config.swagger;
  }

  getEnvironment(): string {
    return this.config.environment;
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isTest(): boolean {
    return this.config.environment === 'test';
  }

  getDbConfig(): DbConfig {
    return this.dbConfig;
  }

  getCookieConfig(): CookieConfig {
    return this.cookieConfig;
  }
  getJWTConfig(): JWTConfig {
    return this.jwtConfig;
  }
}
