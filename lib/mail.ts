import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;

const resend = new Resend(RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not defined');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'FocusFlow AI <noreply@focusflownor.work.gd>',
            to: email,
            subject: 'Verify your email address',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Verify your email</h2>
                    <p>Thanks for signing up for FocusFlow AI! Please use the following code to verify your email address:</p>
                    <div style="background: #f4f4f4; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #6C5CE7;">${code}</span>
                    </div>
                    <p>This code will expire in 10 minutes.</p>
                    <p>If you didn't create an account, you can safely ignore this email.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending email:', error);
            return;
        }

        console.log('Message sent:', data?.id);

    } catch (error: any) {
        console.error('Error sending email:', error.message);
    }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
    if (!RESEND_API_KEY) {
        console.error('RESEND_API_KEY is not defined');
        throw new Error('Email service not configured');
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password/${resetToken}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'FocusFlow AI <noreply@focusflownor.work.gd>',
            to: email,
            subject: 'Reset your password',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2>Reset your Password</h2>
                    <p>You requested a password reset. Click the button below to reset your password:</p>
                    <div style="margin: 20px 0; text-align: center;">
                        <a href="${resetUrl}" style="background: #6C5CE7; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Error sending password reset email:', error);
            throw new Error('Failed to send password reset email');
        }

        console.log('Password reset email sent:', data?.id);
        return data;

    } catch (error: any) {
        console.error('Error sending password reset email:', error.message);
        throw error;
    }
};
