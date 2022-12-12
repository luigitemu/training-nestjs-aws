import { ValidationArguments } from 'class-validator';
import { User } from '../../auth/entities/user.entity';
import { REQUEST_CONTEXT } from './constants';

export interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: User; // IUser is my interface for User class
    };
  };
}
