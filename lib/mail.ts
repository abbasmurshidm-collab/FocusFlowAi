import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, code: string) => {
    // If no API key, log the code (for dev/demo)
    if (!process.env.RESEND_API_KEY) {
        console.log('====================================================');
        console.log(`[DEV] Verification Code for ${email}: ${code}`);
        console.log('====================================================');
        return;
    }

    try {
        const { data, error } = await resend.emails.send({
            from: 'FocusFlow AI <onboarding@resend.dev>',
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
            // Fallback for dev/testing: log the code if email fails
            console.log('====================================================');
            console.log(`[FALLBACK] Verification Code for ${email}: ${code}`);
            console.log('====================================================');
            return;
        }

        console.log('Message sent:', data?.id);

    } catch (error) {
        console.error('Error sending email:', error);
        // Fallback for dev/testing: log the code if email fails
        console.log('====================================================');
        console.log(`[FALLBACK] Verification Code for ${email}: ${code}`);
        console.log('====================================================');
    }
};
