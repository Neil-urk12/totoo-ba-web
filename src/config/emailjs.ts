import emailjs from '@emailjs/browser';

// EmailJS configuration
export const EMAILJS_CONFIG = {
  SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY
};

// Initialize EmailJS
export const initEmailJS = () => {
  emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
};

// Email template parameters interface
interface EmailTemplateParams extends Record<string, unknown> {
  to_email: string;
  to_name: string;
  from_name: string;
  from_email: string;
  phone: string;
  product_name: string;
  manufacturer: string;
  issue_type: string;
  description: string;
  email_channel_description: string;
  submitted_at: string;
  report_id: string;
  subject: string;
  priority: string;
  attachments?: string[];
  attachment_names?: string[];
}

// Send email function
export const sendEmail = async (templateParams: EmailTemplateParams) => {
  try {
    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      templateParams,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS error:', error);
    console.error('Error details:', {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templateId: EMAILJS_CONFIG.TEMPLATE_ID,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? 'Set' : 'Not set',
      templateParams: templateParams
    });
    return { success: false, error };
  }
};

// Send email with attachments (for file uploads)
export const sendEmailWithAttachments = async (templateParams: EmailTemplateParams, attachments: File[]) => {
  try {
    // Convert files to base64 for email attachment
    const attachmentPromises = attachments.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    const base64Attachments = await Promise.all(attachmentPromises);
    
    const paramsWithAttachments = {
      ...templateParams,
      attachments: base64Attachments,
      attachment_names: attachments.map(file => file.name),
    };

    const response = await emailjs.send(
      EMAILJS_CONFIG.SERVICE_ID,
      EMAILJS_CONFIG.TEMPLATE_ID,
      paramsWithAttachments,
      EMAILJS_CONFIG.PUBLIC_KEY
    );
    return { success: true, response };
  } catch (error) {
    console.error('EmailJS error with attachments:', error);
    console.error('Error details:', {
      serviceId: EMAILJS_CONFIG.SERVICE_ID,
      templateId: EMAILJS_CONFIG.TEMPLATE_ID,
      publicKey: EMAILJS_CONFIG.PUBLIC_KEY ? 'Set' : 'Not set',
      templateParams: templateParams,
      attachmentsCount: attachments.length
    });
    return { success: false, error };
  }
};
