import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({ type: 'integer', default: 1 })
  page: number;
  @ApiPropertyOptional({ type: 'integer', default: 10 })
  limit: number;
}
