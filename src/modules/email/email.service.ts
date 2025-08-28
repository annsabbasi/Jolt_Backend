import { Injectable } from "@nestjs/common";
import * as nodemailer from 'nodemailer';


@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(email: string, code: number, firstName: string) {
    const htmlContent = this.getVerificationEmailTemplate(code, firstName);

    await this.transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Verify Your Email Address',
      html: htmlContent
    })
  }

  async sendPasswordResetEmail(email: string, code: number, firstName: string) {
    const htmlContent = this.getPasswordResetEmailTemplate(code, firstName);

    await this.transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.SMTP_FROM}>`,
      to: email,
      subject: 'Reset Your Password',
      html: htmlContent,
    });
  }


  private getVerificationEmailTemplate(code: number, firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .code-box { background: #f8f9fa; border: 2px dashed #007bff; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 5px; font-family: monospace; }
          .button { display: inline-block; background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to ${process.env.APP_NAME}!</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName}!</h2>
          <p>Thanks for signing up! To complete your registration, please verify your email address using the code below:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <p>This verification code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          
          <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; 2024 ${process.env.APP_NAME}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }

  private getPasswordResetEmailTemplate(code: number, firstName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%); color: white; padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
          .code-box { background: #f8f9fa; border: 2px dashed #dc3545; padding: 20px; margin: 20px 0; text-align: center; border-radius: 8px; }
          .code { font-size: 32px; font-weight: bold; color: #dc3545; letter-spacing: 5px; font-family: monospace; }
          .warning { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .footer { background: #f8f9fa; padding: 20px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <h2>Hi ${firstName}!</h2>
          <p>We received a request to reset your password. Use the code below to reset your password:</p>
          
          <div class="code-box">
            <div class="code">${code}</div>
          </div>
          
          <div class="warning">
            <strong>⚠️ Important:</strong> This code will expire in <strong>15 minutes</strong>. If you didn't request a password reset, please ignore this email and your password will remain unchanged.
          </div>
          
          <p>For your security, never share this code with anyone.</p>
          
          <p>Best regards,<br>The ${process.env.APP_NAME} Team</p>
        </div>
        <div class="footer">
          <p>This is an automated email. Please do not reply to this message.</p>
          <p>&copy; 2024 ${process.env.APP_NAME}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;
  }
}