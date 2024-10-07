import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { IsNull, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogCommentEntity } from '../entities/comment.entity';
import { containsSpam } from 'src/common/utils/check-spam.util';
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { BlogService } from './blog.service';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';
import { UserEntity } from 'src/modules/user/entities/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
  constructor(
    @InjectRepository(BlogCommentEntity)
    private blogCommentRepository: Repository<BlogCommentEntity>,
    @Inject(REQUEST) private request: Request,
    @Inject(forwardRef(() => BlogService))
    private blogService: BlogService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const { id: userId } = this.request.user as UserEntity;
    const { text, parentId, blogId } = createCommentDto;
    await this.blogService.checkExistBlogById(blogId);
    let parent = null;
    if (parentId && !isNaN(parentId)) {
      parent = await this.blogCommentRepository.findOneBy({
        id: +parentId,
      });
    }
    if (containsSpam(text)) {
      throw new BadRequestException(PublicMessage.ContainSpam);
    }
    await this.blogCommentRepository.insert({
      text,
      accepted: true,
      blogId,
      parentId: parent ? parentId : null,
      userId,
    });
    return {
      message: PublicMessage.Commented,
    };
  }

  async find(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: {},
      relations: { blog: true, user: { profile: true } },
      select: {
        blog: {
          title: true,
        },
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
      },
      take: limit,
      skip,
      order: { id: 'DESC' },
    });

    return {
      pagination: paginationGenerator(page, limit, count),
      data: comments,
    };
  }

  async checkExistById(id: number) {
    const comment = await this.blogCommentRepository.findOneBy({ id });
    if (!comment) {
      throw new BadRequestException(NotFoundMessage.CommentNotFound);
    }
    return comment;
  }

  async accept(id: number) {
    const comment = await this.checkExistById(id);
    if (comment.accepted)
      throw new BadRequestException(BadRequestMessage.AreadyAccepted);
    comment.accepted = true;
    await this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.Accepted,
    };
  }
  async reject(id: number) {
    const comment = await this.checkExistById(id);
    if (!comment.accepted)
      throw new BadRequestException(BadRequestMessage.AreadyRejected);
    comment.accepted = false;
    await this.blogCommentRepository.save(comment);
    return {
      message: PublicMessage.Rejected,
    };
  }
  async findCommentOfBlog(blogId: number, paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [comments, count] = await this.blogCommentRepository.findAndCount({
      where: { parentId: IsNull(), blogId },
      relations: {
        user: { profile: true },
        children: {
          user: { profile: true },
          children: { user: { profile: true } },
        },
      },
      select: {
        user: {
          username: true,
          profile: {
            nick_name: true,
          },
        },
        children: {
          text: true,
          created_at: true,
          parentId: true,
          user: {
            username: true,
            profile: {
              nick_name: true,
            },
          },
          children: {
            text: true,
            created_at: true,
            parentId: true,
            user: {
              username: true,
              profile: {
                nick_name: true,
              },
            },
          },
        },
      },
      take: limit,
      skip,
      order: { id: 'DESC' },
    });

    return {
      pagination: paginationGenerator(page, limit, count),
      data: comments,
    };
  }
}
