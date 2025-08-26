import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ForgetPasswordDto, GoogleAuthDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto } from "./Dto/auth.dto";
import { ApiTags, ApiBody, ApiResponse } from "@nestjs/swagger";

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    @ApiBody({ type: RegisterDto })
    @ApiResponse({ status: 201, description: 'User registered successfully' })
    @ApiResponse({ status: 400, description: 'User already exists' })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: LoginDto })
    @ApiResponse({ status: 200, description: 'Login successful' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
    }

    @Post('verify-email')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: VerifyEmailDto })
    @ApiResponse({ status: 200, description: 'Email verified successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired verification code' })
    async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
        return this.authService.verifyEmail(verifyEmailDto);
    }

    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ForgetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password reset code sent (if email exists)' })
    async forgotPassword(@Body() forgotPasswordDto: ForgetPasswordDto) {
        return this.authService.forgetPassword(forgotPasswordDto);
    }

    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 400, description: 'Invalid or expired reset code' })
    async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }

    @Post('google')
    @HttpCode(HttpStatus.OK)
    @ApiBody({ type: GoogleAuthDto })
    @ApiResponse({ status: 200, description: 'Google authentication successful' })
    async googleAuth(@Body() googleAuthDto: GoogleAuthDto) {
        return this.authService.googleAuth(googleAuthDto.googleToken);
    }
}
