import { Resend } from "resend";

import { serverEnv } from "@1up/env";

import AuthOtpEmail from "./emails/auth-otp";

type StandardEmailProps = {
  to: string;
};

type AuthEmailOTPProps = {
  type: "auth-otp";
  otpCode: string;
};

type WelcomeEmailProps = {
  type: "welcome";
  username: string;
};

type EmailProps = StandardEmailProps & (AuthEmailOTPProps | WelcomeEmailProps);

export async function sendEmail({ to, type, ...props }: EmailProps) {
  // TODO: FIX react import to HONO to send emails
  const resendApiKey = serverEnv.email.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log("💌========================================💌");
    console.log("Sending email to", to);
    console.log("Email type", type);
    console.log("Email props", props);
    console.log("💌========================================💌");
    return;
  }
  const fetchTemplate = () => {
    switch (type) {
      case "auth-otp":
        return {
          content: AuthOtpEmail({
            otpCode: (props as AuthEmailOTPProps).otpCode,
          }),
          subject: "1up Login Code 🔑",
        };
      // case "welcome":
      //   return {
      //     content: WelcomeEmail({
      //       username: (props as WelcomeEmailProps).username,
      //     }),
      //     subject: "Welcome 1up 🚀",
      //   };
      default:
        console.error("🚨 Unsupported email type", type);
        console.error("🚨 Sending email to", to);
        console.error("🚨 Email props", props);

        return false;
    }
  };

  const template = fetchTemplate();

  if (!template) {
    return false;
  }

  const resend = new Resend(resendApiKey);
  const { error } = await resend.emails.send({
    from: "1up Health Auth <no-reply@1up.xyz>",
    to,
    subject: template.subject,
    react: template.content,
  });

  if (error) {
    console.error("🚨 Error sending email", error);
    console.error("🚨 Sending email to", to);
    console.error("🚨 Email props", props);
    return false;
  }

  return true;
}
