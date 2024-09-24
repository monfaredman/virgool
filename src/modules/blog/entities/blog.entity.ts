import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  UpdateDateColumn,
} from 'typeorm';
import { BlogStatus } from '../enums/status.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import { BlogLikesEntity } from './like.entity';
import { BlogBookmarkEntity } from './bookmark.entity';
import { BlogCommentEntity } from './comment.entity';
import { BlogCategoryEntity } from './blog-category.entity';
@Entity(EntityName.Blog)
export class BlogEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column({ unique: true, nullable: false })
  slug: string;
  @Column()
  time_for_study: number;
  @Column({ default: BlogStatus.Draft })
  status: string;
  @Column()
  authorId: number;
  @ManyToOne(() => UserEntity, (user) => user.blogs, { onDelete: 'CASCADE' })
  author: UserEntity;
  @OneToMany(() => BlogLikesEntity, (like) => like.blog, {
    onDelete: 'CASCADE',
  })
  likes: BlogLikesEntity;
  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.blog, {
    onDelete: 'CASCADE',
  })
  bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => BlogCommentEntity, (comment) => comment.blog, {
    onDelete: 'CASCADE',
  })
  comments: BlogCommentEntity[];
  @OneToMany(() => BlogCategoryEntity, (category) => category.blog)
  categories: BlogCategoryEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
}
