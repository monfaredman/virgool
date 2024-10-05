import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ImageDto {
  @ApiPropertyOptional()
  alt: string;
  @ApiProperty()
  name: string;
  @ApiProperty({ type: 'string', format: 'binary' })
  image: string;
}
