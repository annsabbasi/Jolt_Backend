import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/DB_Service/prisma.service";
import { ForgetPasswordDto, LoginDto, RegisterDto, ResetPasswordDto, VerifyEmailDto } from "./Dto/auth.dto";
import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken';
import { EmailService } from "../email/email.service";



@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService,
        private emailService: EmailService
    ) { }

    // User_Register
    async register(registerDto: RegisterDto) {
        const { email, firstName, lastName, password } = registerDto;

        const existingUser = await this.prisma.user.findUnique({
            where: { email },
        })
        if (existingUser) {
            throw new BadRequestException('User already exists')
        }

        const hashPassword = await bcrypt.hash(password, 12);
        // Generate Verification Code
        const verificationCode = Math.floor(100000 + Math.random() * 900000);
        const verificationExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minute until code expirs

        const user = await this.prisma.user.create({
            data: {
                email,
                password: hashPassword,
                firstName,
                lastName,
                verificationCode,
                verificationExpires,
                isVerified: false,
                authProvider: 'EMAIL'

            }
        })

        // Send Verification Email
        await this.emailService.sendVerificationEmail(email, verificationCode, firstName);

        return {
            message: 'Registration successful. Please check your email for verification code',
            userId: user.id,
        }
    }

    // User_Login
    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.authProvider !== 'EMAIL') {
            throw new UnauthorizedException('Invalid Credientials')
        }
        if (!user.password) {
            throw new UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("Password Incorrect")
        }

        if (!user.isVerified) {
            throw new UnauthorizedException('Please verify your email first');
        }

        // Generate JWT Token
        const token = this.generateJWT(user.id, user.email);

        return {
            token, user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }
    }


    // User_Verify_Email
    async verifyEmail(verifyEmailDto: VerifyEmailDto) {
        const { email, code } = verifyEmailDto;

        const user = await this.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        if (user.verificationCode !== code || !user.verificationExpires || user.verificationExpires < new Date()) {
            throw new BadRequestException('Invalid or expired verification code');
        }

        // Update User as Verified 
        await this.prisma.user.update({
            where: { email },
            data: {
                isVerified: true,
                verificationCode: null,
                verificationExpires: null
            }
        })
        return { message: 'Email Verified' }
    }


    // User_Forget_Password
    async forgetPassword(forgetPassword: ForgetPasswordDto) {
        const { email } = forgetPassword;

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.authProvider !== 'EMAIL') {
            return { message: 'If the email exists, a reset code has been sent.' };
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000);
        const resetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

        await this.prisma.user.update({
            where: { email },
            data: {
                resetPasswordEmail: resetCode,
                resetPasswordExpires: resetExpires
            }
        });

        // Send reset email
        await this.emailService.sendPasswordResetEmail(email, resetCode, user.firstName)
        return { message: 'The reset Code has been send to you email address' }
    }


    // User_Reset_Password
    async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { email, code, newPassword } = resetPasswordDto

        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user || user.resetPasswordEmail !== code || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
            throw new BadRequestException('Invalid or expired reset code');
        }
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await this.prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                resetPasswordEmail: null,
                resetPasswordExpires: null,
            },
        });

        return { message: 'Password reset successfully' };
    }


    // The_Google_Auth
    async googleAuth(googleToken: string) {
        const googleUser = await this.verifyGoogleToken(googleToken);

        let user = await this.prisma.user.findUnique({
            where: { email: googleUser.email },
        });

        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    email: googleUser.email,
                    firstName: googleUser.firstName,
                    lastName: googleUser.lastName,
                    isVerified: true,
                    authProvider: 'GOOGLE',
                    googleId: googleUser.id,
                    password: null
                },
            });
        }

        const token = this.generateJWT(user.id, user.email);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        }
    }


    // User_JWT
    private generateJWT(userId: string, email: string): string {
        return jwt.sign(
            { userId, email },
            "process.env.JWT_SECRET",
            { expiresIn: '7d' }
        )
    }


    // Verify_Google_Auth
    private async verifyGoogleToken(token: string) {
        const { OAuth2Client } = require('google-auth-library');
        const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload();
        return {
            id: payload.sub,
            email: payload.email,
            firstName: payload.given_name,
            lastName: payload.family_name,
        };
    }

}