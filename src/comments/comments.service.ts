import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comments.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private commentsRepository: Repository<Comments>,
  ) {}
  async save(user: User, data: CreateCommentDto) {
    // TODO: save to DB
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
      throw new InternalServerErrorException('Check Logs');
    }
  }
}
