import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogLikesEntity } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';

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
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService, CategoryService],
})
export class BlogModule {}
