import type { APIRoute } from 'astro';
import { Resend } from 'resend';

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.formData();
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');


    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ message: "All fields are required" }), 
        { status: 400 }
      );
    }

    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: 'plazaivanalt@gmail.com',
      subject: `🚀 New Inquiry from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 20px;">New Portfolio Message</h2>
          </div>
          <div style="padding: 24px; color: #374151; line-height: 1.5;">
            <p style="margin-bottom: 20px; font-size: 16px;">You have received a new message through your portfolio contact form:</p>
            
            <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; margin-bottom: 20px;">
              <p style="margin: 0 0 8px 0;"><strong>Name:</strong> ${name}</p>
              <p style="margin: 0 0 8px 0;"><strong>Email:</strong> <a href="mailto:${email}" style="color: #2563eb;">${email}</a></p>
            </div>

            <div style="border-top: 1px solid #e5e7eb; pt: 20px;">
              <p style="margin-top: 20px;"><strong>Message:</strong></p>
              <p style="white-space: pre-wrap; color: #4b5563; font-style: italic;">"${message}"</p>
            </div>
          </div>
          <div style="background-color: #f3f4f6; padding: 12px; text-align: center; font-size: 12px; color: #9ca3af;">
            This email was sent from your Astro Portfolio API.
          </div>
        </div>
      `,
    });

    if (error) {
      return new Response(
        JSON.stringify({ error }), 
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Sent successfully!" }), 
      { status: 200 }
    );

  } catch (e) {
    return new Response(
      JSON.stringify({ message: "Internal server error" }), 
      { status: 500 }
    );
  }
};