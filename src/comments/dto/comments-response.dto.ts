import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class CommentsReponseDto {
  @Expose()
  @IsString()
  Comment: string;
}
