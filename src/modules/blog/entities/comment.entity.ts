import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { UserEntity } from 'src/modules/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BlogEntity } from './blog.entity';
@Entity(EntityName.BlogComment)
export class BlogCommentEntity extends BaseEntity {
  @Column()
  text: string;
  @Column({ default: false })
  accepted: boolean;
  @Column()
  blogId: number;
  @Column()
  userId: number;
  @Column()
  parentId: number;
  @CreateDateColumn()
  created_at: Date;
  @ManyToOne(() => UserEntity, (user) => user.blog_comments, {
    onDelete: 'CASCADE',
  })
  user: UserEntity;
  @ManyToOne(() => BlogCommentEntity, (parent) => parent.children, {
    onDelete: 'CASCADE',
  })
  parent: BlogCommentEntity;
  @ManyToOne(() => BlogEntity, (blog) => blog.comments, {
    onDelete: 'CASCADE',
  })
  blog: BlogEntity;
  @OneToMany(() => BlogCommentEntity, (comment) => comment.parent, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent' })
  children: BlogCommentEntity[];
}
