import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function Pagination() {
  return applyDecorators(
    ApiQuery({ name: 'page', required: false, type: 'integer' }),
    ApiQuery({ name: 'limit', required: false, type: 'integer' }),
  );
}
