import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

import { User } from '../../auth/entities/user.entity';
import { REQUEST_CONTEXT, REQUIRED_ROLES } from '../constants/constants';
import { Roles } from '../constants/enums';

interface ExtendedValidationArguments extends ValidationArguments {
  object: {
    [REQUEST_CONTEXT]: {
      user: User; // IUser is my interface for User class
    };
  };
}
interface RolesOptions extends ValidationOptions {
  roles: Roles[];
}

export function RequiredRoles(validationOptions?: RolesOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: REQUIRED_ROLES,
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate: (value: unknown, args: ExtendedValidationArguments) => {
          const userRoles = args?.object[REQUEST_CONTEXT].user.Roles;
          const isValid = userRoles.some((role) =>
            validationOptions.roles.includes(+role),
          );

          return isValid;
        },
        defaultMessage: () =>
          'This user is not authorized to perform this action',
      },
    });
  };
}
