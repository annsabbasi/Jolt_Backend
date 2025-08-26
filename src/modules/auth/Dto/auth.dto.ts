import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'password123', minLength: 8 })
    @IsString()
    @MinLength(8)
    password: string;

    @ApiProperty({ example: 'John' })
    @IsString()
    firstName: string;

    @ApiProperty({ example: 'Doe' })
    @IsString()
    lastName: string;
}

export class LoginDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: 'abcd1234' })
    @IsString()
    password: string;
}

export class VerifyEmailDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: '123456' })
    @IsNumber()
    code: number;
}

export class ForgetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string

    @ApiProperty({ example: '123456' })
    @IsNumber()
    code: number

    @ApiProperty({ example: '1234abcd' })
    @IsString()
    @MinLength(8)
    newPassword: string
}

export class GoogleAuthDto {
    @ApiProperty({ example: 'abcdefgh' })
    @IsString()
    googleToken: string
}