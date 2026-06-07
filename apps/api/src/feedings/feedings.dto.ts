import { IsIn, IsInt, IsISO8601, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateFeedingDto {
  @IsInt()
  plantId!: number;

  @IsString()
  @MinLength(1)
  feed!: string;

  @IsISO8601({ strict: false })
  dueDate!: string;

  @IsISO8601({ strict: false })
  @IsOptional()
  fedAt?: string;
}

export class CreateSnoozeDto {
  @IsInt()
  plantId!: number;

  @IsString()
  @MinLength(1)
  feed!: string;

  @IsISO8601({ strict: false })
  dueDate!: string;

  @IsIn([1, 3, 7])
  days!: 1 | 3 | 7;
}
