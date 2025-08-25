import { IsEmail, IsNumber, IsString, MinLength } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(8)
    password: string;

    @IsString()
    firstName: string;

    @IsString()
    lastName: string;
}

export class LoginDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class VerifyEmailDto {
    @IsEmail()
    email: string

    @IsNumber()
    code: number;
}

export class ForgetPasswordDto {
    @IsEmail()
    email: string
}

export class ResetPasswordDto {
    @IsEmail()
    email: string

    @IsNumber()
    code: number

    @IsString()
    @MinLength(8)
    newPassword: string
}

export class GoogleAuthDto {
    @IsString()
    googleToken: string
}