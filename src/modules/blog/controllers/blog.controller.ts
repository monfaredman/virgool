import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Query,
  Delete,
  ParseIntPipe,
  Param,
  Put,
} from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SwaggerConsumes } from 'src/common/enums/swagger-consumes.enum.';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { SkipAuth } from 'src/common/decorators/skip-auth.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';

@Controller('blog')
@ApiTags('Blog')
@ApiBearerAuth('Authorization')
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post('/')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  create(@Body() blogDto: CreateBlogDto) {
    return this.blogService.create(blogDto);
  }

  @Get('/my')
  myBlogs() {
    return this.blogService.myBlogs();
  }

  @Get('/')
  @Pagination()
  @SkipAuth()
  @FilterBlog()
  find(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: FilterBlogDto,
  ) {
    return this.blogService.blogList(paginationDto, filterDto);
  }

  @Delete('/:id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.delete(id);
  }

  @Put('/:id')
  @ApiConsumes(SwaggerConsumes.UrlEncoded, SwaggerConsumes.Json)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() blogDto: UpdateBlogDto,
  ) {
    return this.blogService.update(id, blogDto);
  }

  @Get('/like/:id')
  likeToggle(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.likeToggle(id);
  }
  @Get('/bookmark/:id')
  bookmarkToggle(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.bookmarkToggle(id);
  }

  @Get('/by-slug/:slug')
  findOneBySlug(@Param('slug') slug: string) {
    return this.blogService.findOneBySlug(slug);
  }
}
