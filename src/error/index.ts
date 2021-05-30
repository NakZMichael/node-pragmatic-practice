import { AppLogger } from '../logging';

interface AppErrorProps{
  shouldCrash: boolean
  logger: AppLogger
  description: string
}

class AppError extends Error {
  public shouldCrash: boolean
  public logger: AppLogger
  constructor({ description, shouldCrash, logger }: AppErrorProps) {
    super(description);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
    this.shouldCrash = shouldCrash;
    this.logger = logger;
  } 
}

interface WrappedErrorProps extends AppErrorProps{
  originalError: Error
}

class WrappedError extends AppError{

  originalError: Error
  constructor({ description, shouldCrash, originalError, logger }: WrappedErrorProps){
    super({ description, shouldCrash, logger });
    this.originalError = originalError;
  }
}

export {
  AppError,
  WrappedError,
};