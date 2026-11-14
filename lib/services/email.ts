export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const emailService = {
  async sendApplicationReceived(to: string, reference: string, statusToken: string): Promise<boolean> {
    const statusUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/talent-network/status?token=${statusToken}&ref=${reference}`;
    const subject = `Application Received: ${reference} — LeadVerify Talent Network`;
    const text = `Thank you for registering with the LeadVerify Talent Network.\n\nYour reference number is: ${reference}\n\nTrack your application progress, provide updates, or withdraw anytime here:\n${statusUrl}\n\nPlease note: Registration does not guarantee employment, client placement, contracts or earnings. We will contact you if your profile matches upcoming requirements.`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0F2540; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1D5FB8;">Application Received</h2>
        <p>Thank you for registering with the <strong>LeadVerify Talent Network</strong>.</p>
        <div style="background: #EEF5FF; border: 1px solid #D5E3F5; padding: 16px 20px; border-radius: 8px; margin: 20px 0;">
          <div style="font-size: 12px; color: #44546A; text-transform: uppercase; font-weight: bold;">Your Reference</div>
          <div style="font-size: 24px; color: #0F2540; font-weight: bold;">${reference}</div>
        </div>
        <p>You can check your status or manage your registration at any time:</p>
        <p><a href="${statusUrl}" style="display: inline-block; background: #1D5FB8; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Application Status</a></p>
        <p style="font-size: 13px; color: #44546A; border-top: 1px solid #D5E3F5; padding-top: 16px; margin-top: 24px;">
          Registration is free and does not guarantee employment, client placement, contracts or earnings. We will contact you if your profile matches upcoming client requirements.
        </p>
      </div>
    `;
    return this.dispatch({ to, subject, text, html });
  },

  async sendStatusUpdated(to: string, reference: string, newStatus: string, note?: string): Promise<boolean> {
    const subject = `Status Update: ${reference} (${newStatus.replace(/_/g, ' ')})`;
    const text = `Your application ${reference} status has been updated to: ${newStatus}.\n\n${note ? `Note: ${note}\n\n` : ''}You can review details in your talent portal.`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0F2540; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #1D5FB8;">Application Status Update</h2>
        <p>Reference: <strong>${reference}</strong></p>
        <p>Your application status has been updated to: <span style="background: #EEF5FF; padding: 4px 10px; border-radius: 6px; font-weight: bold; color: #1D5FB8;">${newStatus.replace(/_/g, ' ')}</span></p>
        ${note ? `<p style="background: #f8fafc; border-left: 3px solid #1D5FB8; padding: 12px;">${note}</p>` : ''}
      </div>
    `;
    return this.dispatch({ to, subject, text, html });
  },

  async sendWithdrawalConfirmed(to: string, reference: string): Promise<boolean> {
    const subject = `Application Withdrawn: ${reference}`;
    const text = `Your application ${reference} with LeadVerify Talent Network has been withdrawn as requested. Your documents and personal information are marked for deletion in compliance with POPIA.`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #0F2540; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0F2540;">Application Withdrawn</h2>
        <p>Your application <strong>${reference}</strong> has been withdrawn.</p>
        <p>In accordance with our POPIA data retention policy, your application records are marked as withdrawn and scheduled for secure deletion.</p>
      </div>
    `;
    return this.dispatch({ to, subject, text, html });
  },

  async dispatch(payload: EmailPayload): Promise<boolean> {
    // In production, integrate Resend, Postmark, SendGrid or AWS SES here.
    // In development and testing, log clearly without leaking secrets:
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[EmailService] Dispatched to ${payload.to}: "${payload.subject}"`);
    }
    return true;
  },
};
