import { BadRequestException, Inject, Injectable, Scope } from '@nestjs/common';
import { BlogEntity } from './entities/blog.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto, FilterBlogDto } from './dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { BlogStatus } from './enums/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  BadRequestMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../category/category.service';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { EntityName } from 'src/common/enums/entity.enum';

// import { CreateBlogDto } from './dto/create-blog.dto';
// import { UpdateBlogDto } from './dto/update-blog.dto';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
  ) {}

  async create(blogDto: CreateBlogDto) {
    const user = this.request.user;

    let {
      // eslint-disable-next-line prefer-const
      title,
      slug,
      // eslint-disable-next-line prefer-const
      content,
      // eslint-disable-next-line prefer-const
      description,
      // eslint-disable-next-line prefer-const
      image,
      // eslint-disable-next-line prefer-const
      time_for_study,
      categories,
    } = blogDto;
    // const slugData = slug ?? title;
    // slug = createSlug(slugData);

    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }

    // Ensure slug is created from title if it's missing
    if (!slug || slug.trim() === '') {
      slug = createSlug(title);
    }
    const isExist = await this.checkBlogBySlug(slug);
    if (isExist) {
      slug += `-${randomId()}`;
    }
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
    for (const categoryTitle of categories) {
      let category = await this.categoryService.findOneByTitle(categoryTitle);
      if (!category) {
        category = await this.categoryService.insertByTitle(categoryTitle);
      }
      await this.blogCategoryRepository.insert({
        blogId: blog.id,
        categoryId: category.id,
      });
    }
    return {
      message: PublicMessage.Created,
    };
  }
  async checkBlogBySlug(slug: string) {
    const blog = await this.blogRepository.findOneBy({ slug });
    return !!blog;
  }

  myBlogs() {
    const { id } = this.request.user;

    return this.blogRepository.find({
      where: { authorId: id },
      order: { id: 'DESC' },
    });
  }
  async blogList(paginationDto: PaginationDto, filterDto: FilterBlogDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    let { category, search } = filterDto;
    let where = '';
    if (category) {
      category = category.toLowerCase();
      if (where.length > 0) where += ' AND ';
      where += 'category.title = LOWER(:category)';
    }
    if (search) {
      if (where.length > 0) where += ' AND ';
      search = `%${search}%`;
      where +=
        'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
    }
    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .addSelect(['categories.id', 'category.title'])
      .where(where, { category, search })
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return {
      pagination: paginationGenerator(count, limit, page),
      data: blogs,
    };
  }
}
