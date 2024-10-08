import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function FilterBlog() {
  return applyDecorators(
    ApiQuery({ name: 'category', required: false, type: 'string' }),
    ApiQuery({ name: 'search', required: false, type: 'string' }),
  );
}
