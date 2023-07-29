import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateDepositDTO {
  @Min(1)
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  sourceDescription: string;

  @IsString()
  @IsNotEmpty()
  sourceTransactionId: string;

  @IsString()
  @IsNotEmpty()
  source: string;

  @IsUUID()
  @IsNotEmpty()
  userId: string;
}
