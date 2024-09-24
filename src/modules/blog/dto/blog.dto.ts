import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, Length } from 'class-validator';

export class CreateBlogDto {
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 150)
  title: string;
  @ApiPropertyOptional()
  slug: string;
  @ApiProperty()
  @IsNotEmpty()
  @IsNumberString()
  time_for_study: number;
  @ApiPropertyOptional({ type: 'string', format: 'binary' })
  image: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 300)
  description: string;
  @ApiProperty()
  @IsNotEmpty()
  @Length(100)
  content: string;
  @ApiProperty({ type: String, isArray: true })
  // @IsArray()
  categories: string[] | string;
}

export class FilterBlogDto {
  category: string;
}
