import { Controller } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../auth/entities/user.entity';
import { Serialize } from '../auth/Interceptors/serialize-interceptor';

import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentsReponseDto } from './dto/comments-response.dto';

@ApiTags('Comments')
@Controller('comments')
@Serialize(CommentsReponseDto)
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(AuthGuard())
  async save(
    @GetUser() user: User,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.save(user, createCommentDto);
  }
}
