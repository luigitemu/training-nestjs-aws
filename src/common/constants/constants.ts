export const allowedFileTypesRegex =
  /\.(mp4|avi|mov|wmv|flv|mpeg|mpg|mkv|jpeg|jpg|png|gif)$/i;

export const REQUEST_CONTEXT = '_requestContext';
export const REQUIRED_ROLES = 'RequiredRoles';

export const passwordRegex =
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

export const urlSignedExpiredTime = 3600;

export const saltsOrRounds = 10;

export const RECORD_EXIST_ERROR = '23505';

export const RECORD_NOT_FOUND_ERROR = '23502';
