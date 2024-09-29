import { Module } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { BlogLikesEntity } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentController } from './controllers/comment.controller';
import { BlogCommentEntity } from './entities/comment.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      BlogEntity,
      CategoryEntity,
      BlogCategoryEntity,
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogBookmarkEntity,
      BlogLikesEntity,
      BlogCommentEntity,
    ]),
  ],
  controllers: [BlogController, BlogCommentController],
  providers: [BlogService, CategoryService, BlogCommentService],
})
export class BlogModule {}
