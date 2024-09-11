import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity } from 'typeorm';

@Entity(EntityName.Profile)
export class ProfileEntity extends BaseEntity {
  @Column({ nullable: true })
  nick_name: string;
  @Column({ nullable: true })
  bio: string;
  @Column({ nullable: true })
  image_profile: string;
  @Column({ nullable: true })
  gender: string;
  @Column({ nullable: true })
  birthday: string;
  @Column({ nullable: true })
  linkedin_profile: string;
}
