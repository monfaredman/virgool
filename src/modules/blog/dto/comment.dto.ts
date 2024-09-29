import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumberString, IsOptional, Length } from 'class-validator';

export class CreateCommentDto {
  @ApiProperty()
  @Length(5)
  text: string;
  @ApiProperty()
  @IsNumberString()
  blogId: number;
  @ApiPropertyOptional()
  @IsNumberString()
  @IsOptional()
  parentId: number;
}
