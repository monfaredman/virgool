import { BlogCommentService } from './comment.service';
import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  Scope,
} from '@nestjs/common';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { createSlug, randomId } from 'src/common/utils/functions.util';
import { BlogStatus } from '../enums/status.enum';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import {
  BadRequestMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';
import { isArray } from 'class-validator';
import { CategoryService } from '../../category/category.service';
import { BlogCategoryEntity } from '../entities/blog-category.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { BlogLikesEntity } from '../entities/like.entity';
import { BlogBookmarkEntity } from '../entities/bookmark.entity';

@Injectable({ scope: Scope.REQUEST })
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogRepository: Repository<BlogEntity>,
    @InjectRepository(BlogCategoryEntity)
    private blogCategoryRepository: Repository<BlogCategoryEntity>,
    @InjectRepository(BlogLikesEntity)
    private blogLikeRepository: Repository<BlogLikesEntity>,
    @InjectRepository(BlogBookmarkEntity)
    private blogBookmarkRepository: Repository<BlogBookmarkEntity>,
    @Inject(REQUEST) private request: Request,
    private categoryService: CategoryService,
    @Inject(forwardRef(() => BlogCommentService))
    private blogCommentService: BlogCommentService,
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
    return blog;
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
      search = `%${search.toLowerCase()}%`;
      where +=
        'CONCAT(blog.title, blog.description, blog.content) ILIKE :search';
    }
    const [blogs, count] = await this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .leftJoin('blog.categories', 'categories')
      .leftJoin('categories.category', 'category')
      .leftJoin('blog.author', 'author')
      .leftJoin('author.profile', 'profile')
      .addSelect([
        'categories.id',
        'category.title',
        'author.id',
        'author.username',
        'profile.nick_name',
      ])
      .where(where, { category, search })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .loadRelationCountAndMap(
        'blog.comments',
        'blog.comments',
        'comments',
        (qb) => qb.andWhere('comments.accepted = true', { accepted: true }),
      )
      .orderBy('blog.id', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return {
      pagination: paginationGenerator(count, limit, page),
      data: blogs,
    };
  }
  async checkExistBlogById(id: number) {
    const blog = await this.blogRepository.findOneBy({ id });
    if (!blog) {
      throw new NotFoundException(NotFoundMessage.BlogNotFound);
    }
    return blog;
  }
  async delete(id: number) {
    await this.checkExistBlogById(id);
    await this.blogRepository.delete({ id });
    return {
      message: PublicMessage.Deleted,
    };
  }
  async update(id: number, blogDto: UpdateBlogDto) {
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
    const blog = await this.checkExistBlogById(id);
    if (!isArray(categories) && typeof categories === 'string') {
      categories = categories.split(',');
    } else if (!isArray(categories)) {
      throw new BadRequestException(BadRequestMessage.InvalidCategory);
    }

    let slugDate = null;
    if (title) {
      slugDate = title;
      blog.title = title;
    }
    if (slug) slugDate = slug;
    if (slugDate) {
      slug = createSlug(slugDate);
      const isExist = await this.checkBlogBySlug(slug);
      if (isExist && isExist.id !== id) {
        slug += `-${randomId()}`;
      }
      blog.slug = slug;
    }
    if (content) blog.content = content;
    if (description) blog.description = description;
    if (image) blog.image = image;
    if (time_for_study) blog.time_for_study = time_for_study;
    await this.blogRepository.save(blog);
    if (categories && isArray(categories) && categories.length > 0) {
      await this.blogCategoryRepository.delete({ blogId: blog.id });
    }
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
      message: PublicMessage.Updated,
    };
  }

  async likeToggle(blogId: number) {
    const { id: userId } = this.request.user;
    await this.checkExistBlogById(blogId);
    const isLiked = await this.blogLikeRepository.findOneBy({ userId, blogId });
    let message = PublicMessage.Like;
    if (isLiked) {
      await this.blogLikeRepository.delete({ id: isLiked.id });
      message = PublicMessage.Dislike;
    } else {
      await this.blogLikeRepository.insert({
        userId,
        blogId,
      });
    }
    return {
      message,
    };
  }
  async bookmarkToggle(blogId: number) {
    const { id: userId } = this.request.user;
    await this.checkExistBlogById(blogId);
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId,
    });
    let message = PublicMessage.Bookmarked;
    if (isBookmarked) {
      await this.blogBookmarkRepository.delete({ id: isBookmarked.id });
      message = PublicMessage.UnBookmarked;
    } else {
      await this.blogBookmarkRepository.insert({
        userId,
        blogId,
      });
    }
    return {
      message,
    };
  }
  async findOneBySlug(slug: string, paginationDto: PaginationDto) {
    const userId = this.request?.user?.id;
    const blog = await this.blogRepository
      .createQueryBuilder(EntityName.Blog)
      .where({ slug })
      .loadRelationCountAndMap('blog.likes', 'blog.likes')
      .loadRelationCountAndMap('blog.bookmarks', 'blog.bookmarks')
      .getOne();
    if (!blog) throw new NotFoundException(NotFoundMessage.BlogNotFound);
    const commentData = await this.blogCommentService.findCommentOfBlog(
      blog.id,
      paginationDto,
    );
    const isLiked = await this.blogLikeRepository.findOneBy({
      userId,
      blogId: blog.id,
    });
    const isBookmarked = await this.blogBookmarkRepository.findOneBy({
      userId,
      blogId: blog.id,
    });
    return {
      ...blog,
      isLiked: !!isLiked,
      isBookmarked: !!isBookmarked,
      commentData,
    };
  }
}
