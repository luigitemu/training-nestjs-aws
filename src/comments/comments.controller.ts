import { Controller } from '@nestjs/common';
import { Body, Post, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from 'src/auth/decorators/get-user.decorator';

import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { Comments } from './entities/comments.entity';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @ApiResponse({
    status: 201,
    description: 'The comment has been successfully created.',
    type: Comments,
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
    @GetUser('Id') userId: number,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    return await this.commentsService.save(userId, createCommentDto);
  }
}
