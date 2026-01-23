import { internalAction } from './_generated/server';
import { v } from 'convex/values';

export const sendOTP = internalAction({
  args: {
    phoneNumber: v.string(),
    otpCode: v.string(),
  },
  handler: async (ctx, args) => {
    const { phoneNumber, otpCode } = args;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      throw new Error('Missing WhatsApp configuration');
    }

    const graphApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    // WhatsApp API expects phone number without +
    const cleanPhone = phoneNumber.replace(/^\+/, '');

    const template = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'template',
      template: {
        name: 'verify_code',
        language: {
          code: 'en_US',
        },
        components: [
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: otpCode,
              },
            ],
          },
          {
            type: 'button',
            sub_type: 'url',
            index: '0',
            parameters: [
              {
                type: 'text',
                text: otpCode,
              },
            ],
          },
        ],
      },
    };

    console.log('Sending WhatsApp OTP:', {
      url: graphApiUrl,
      to: cleanPhone,
      template: JSON.stringify(template, null, 2),
    });

    try {
      const response = await fetch(graphApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(template),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error(
          'WhatsApp API Error Response:',
          JSON.stringify(data, null, 2),
        );
        throw new Error(
          data.error?.message || `WhatsApp API error: ${response.statusText}`,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('WhatsApp send OTP error:', error);
      throw new Error(error.message || 'Failed to send WhatsApp message');
    }
  },
});

export const sendMessage = internalAction({
  args: {
    phoneNumber: v.string(),
    message: v.string(),
  },
  handler: async (ctx, args) => {
    const { phoneNumber, message } = args;
    const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (!accessToken || !phoneNumberId) {
      throw new Error('Missing WhatsApp configuration');
    }

    const graphApiUrl = `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`;

    // WhatsApp API expects phone number without +
    const cleanPhone = phoneNumber.replace(/^\+/, '');

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: cleanPhone,
      type: 'text',
      text: {
        preview_url: false,
        body: message,
      },
    };

    try {
      const response = await fetch(graphApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message || `WhatsApp API error: ${response.statusText}`,
        );
      }

      return {
        success: true,
        data,
      };
    } catch (error: any) {
      console.error('WhatsApp send message error:', error);
      throw new Error(error.message || 'Failed to send WhatsApp message');
    }
  },
});
