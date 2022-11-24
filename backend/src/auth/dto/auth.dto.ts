import { IsNotEmpty, IsString, IsEmail } from 'class-validator';
export class AuthDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class AuthDtoWithName extends AuthDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
