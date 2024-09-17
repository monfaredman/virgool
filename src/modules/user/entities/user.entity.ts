import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
} from 'typeorm';
import { OTPEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogLikesEntity } from 'src/modules/blog/entities/like.entity';
import { BlogBookmarkEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentEntity } from 'src/modules/blog/entities/comment.entity';
@Entity(EntityName.User)
export class UserEntity extends BaseEntity {
  @Column({ unique: true, nullable: true })
  username: string;
  @Column({ unique: true, nullable: true })
  phone: string;
  @Column({ unique: true, nullable: true })
  email: string;
  @Column({ nullable: true })
  new_phone: string;
  @Column({ nullable: true })
  new_email: string;
  @Column({ nullable: true, default: false })
  verify_email: boolean;
  @Column({ unique: true, default: false })
  verify_phone: boolean;
  @Column({ nullable: true })
  password: string;
  @Column({ nullable: true })
  otpId: number;
  @Column({ nullable: true })
  profileId: number;
  @OneToOne(() => OTPEntity, (otp) => otp.user, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'otpId' })
  otp: OTPEntity;
  @OneToMany(() => BlogEntity, (blog) => blog.author, { onDelete: 'CASCADE' })
  blogs: BlogEntity[];
  @OneToMany(() => BlogLikesEntity, (blog) => blog.user, {
    onDelete: 'CASCADE',
  })
  blog_likes: BlogLikesEntity[];
  @OneToMany(() => BlogBookmarkEntity, (bookmark) => bookmark.user, {
    onDelete: 'CASCADE',
  })
  blog_bookmarks: BlogBookmarkEntity[];
  @OneToMany(() => BlogCommentEntity, (comment) => comment.user, {
    onDelete: 'CASCADE',
  })
  blog_comments: BlogCommentEntity[];
  @CreateDateColumn()
  created_at: Date;
  @UpdateDateColumn()
  updated_at: Date;
  @OneToOne(() => ProfileEntity, (profile) => profile.user, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  profile: ProfileEntity;
}
