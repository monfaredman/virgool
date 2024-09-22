import { Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { createSlug } from 'src/common/utils/functions.util';
import { BlogStatus } from './enums/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { PublicMessage } from 'src/common/enums/message.enum';

// import { CreateBlogDto } from './dto/create-blog.dto';
// import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @Inject(REQUEST) private request: Request,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;

    // eslint-disable-next-line prefer-const
    let { title, slug, content, description, image, time_for_study } = blogDto;
    const slugData = slug ?? title;
    slug = createSlug(slugData);
    const blog = this.blogRepository.create({
      title,
      slug,
      content,
      description,
      image,
      time_for_study,
      status: BlogStatus.Draft,
      authorId: user.id,
    });
    await this.blogRepository.save(blog);
    return {
      message: PublicMessage.Created,
    };
  }

  findAll() {
    return `This action returns all blog`;
  }

  findOne(id: number) {
    return `This action returns a #${id} blog`;
  }

  // update(id: number, updateBlogDto: UpdateBlogDto) {
  //   return `This action updates a #${id} blog`;
  // }

  remove(id: number) {
    return `This action removes a #${id} blog`;
  }
}
