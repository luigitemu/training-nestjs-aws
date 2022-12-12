import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CommentsReponseDto {
  @Expose()
  @IsString()
  Id: string;

  @Expose()
  @IsString()
  Comment: string;
}
