import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Comments } from './entities/comments.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { User } from 'src/auth/entities/user.entity';
import { RECORD_NOT_FOUND_ERROR } from 'src/common/constants/constants';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}
  async save(user: User, data: CreateCommentDto) {
    try {
      const { Comment, FileId } = data;

      const newComment = this.commentsRepository.create({
        Comment,
        User: user,
        File: {
          Id: FileId,
        },
      });

      await this.commentsRepository.save(newComment);
      return newComment;
    } catch (error) {
      if (error.code === RECORD_NOT_FOUND_ERROR) {
        throw new BadRequestException('User or file not found');
      }
      throw new InternalServerErrorException('Check Logs');
    }
  }
}
