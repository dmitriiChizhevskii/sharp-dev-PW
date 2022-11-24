import { IsNotEmpty, IsString, IsEmail, IsNumber } from 'class-validator';
export class newTransactionDto {
  @IsNotEmpty()
  @IsString()
  receiverId: string;
  @IsNotEmpty()
  @IsNumber()
  amount: number;
}
