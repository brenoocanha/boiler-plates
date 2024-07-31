import { plainToInstance } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  validateSync,
} from 'class-validator';

class EnvironmentVariables {

  // Database configuration

  @IsString()
  @IsNotEmpty()
  DATABASE_HOST: string;

  @IsNumber()
  @IsNotEmpty()
  DATABASE_PORT: number;

  @IsString()
  @IsNotEmpty()
  DATABASE_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DATABASE_NAME: string;

  @IsString()
  @Matches(
    /^postgresql:\/\/([a-zA-Z0-9_\-]+):([a-zA-Z0-9_\-]+)@([a-zA-Z0-9.\-]+):(\d+)\/([a-zA-Z0-9_\-]+)$/,
  )
  DATABASE_URL: string;

  // Stripe configuration (payment gateway)

  @IsString()
  @IsNotEmpty()
  STRIPE_API_KEY: string;

  // Secrets & Challenges

  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  @IsString()
  @IsNotEmpty()
  JWT_REFRESH_TOKEN_SECRET: string;

  // Email configuration
  @IsString()
  @IsNotEmpty()
  EMAIL_HOST: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_PORT: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_USERNAME: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  EMAIL_FROM: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
