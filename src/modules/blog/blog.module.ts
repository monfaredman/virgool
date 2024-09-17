import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { BlogLikesEntity } from './entities/like.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogBookmarkEntity } from './entities/bookmark.entity';
import { BlogCategoryEntity } from './entities/blog-category.entity';
import { BlogEntity } from './entities/blog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogLikesEntity,
      BlogBookmarkEntity,
      BlogCategoryEntity,
      BlogEntity,
      BlogBookmarkEntity,
      BlogLikesEntity,
    ]),
  ],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
