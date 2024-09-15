import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import {
  ConflictMessage,
  NotFoundMessage,
  PublicMessage,
} from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import {
  paginationGenerator,
  paginationSolver,
} from 'src/common/utils/pagination.util';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    // eslint-disable-next-line prefer-const
    let { title, priority } = createCategoryDto;
    title = await this.checkExistAndResolveTitle(title);
    const category = this.categoryRepository.create({ title, priority });
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Created,
    };
  }

  async checkExistAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase();
    const category = await this.categoryRepository.findOneBy({ title });
    if (category)
      throw new ConflictException(ConflictMessage.CategoryTitleExistence);
    return title;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit, page, skip } = paginationSolver(paginationDto);
    const [categories, count] = await this.categoryRepository.findAndCount({
      where: {},
      order: { id: 'ASC' },
      skip,
      take: limit,
    });
    return {
      pagination: paginationGenerator(count, limit, page),
      categories,
    };
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category)
      throw new NotFoundException(NotFoundMessage.CategoryNotFound);
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);
    const { title, priority } = updateCategoryDto;
    if (title) category.title = title;
    if (priority) category.priority = priority;
    await this.categoryRepository.save(category);
    return {
      message: PublicMessage.Updated,
    };
  }

  async remove(id: number) {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return {
      message: PublicMessage.Deleted,
    };
  }
}
