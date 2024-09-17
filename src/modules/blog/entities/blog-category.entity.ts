import { BaseEntity } from 'src/common/abstracts/base.entity';
import { EntityName } from 'src/common/enums/entity.enum';
import { Column, Entity } from 'typeorm';
@Entity(EntityName.Blog)
export class BlogCategoryEntity extends BaseEntity {
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  content: string;
  @Column({ nullable: true })
  image: string;
  @Column()
  authorId: number;
}
