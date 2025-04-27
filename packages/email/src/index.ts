import { Resend } from "resend";

import { serverEnv } from "@potential/env";

import AuthOtpEmail from "./emails/auth-otp";
import BugReportEmail from "./emails/bug-report";

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
type BugReportEmailProps = {
  type: "bug-report";
  message: string;
  userEmail: string;
};

type EmailProps = StandardEmailProps &
  (AuthEmailOTPProps | WelcomeEmailProps | BugReportEmailProps);

export async function sendEmail({ to, type, ...props }: EmailProps) {
  // TODO: FIX react import to HONO to send emails
  const resendApiKey = serverEnv.email.RESEND_API_KEY;
  if (!resendApiKey) {
    console.log("💌========================================💌");
    console.log("Sending email to", to);
    console.log("Email type", type);
    console.log("Email props", props);
    console.log("💌========================================💌");
    return true;
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
      case "bug-report":
        return {
          content: BugReportEmail({
            message: (props as BugReportEmailProps).message,
            userEmail: (props as BugReportEmailProps).userEmail,
          }),
          subject: "🚨 Bug Report from 1up Health",
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

  if (type === "bug-report") {
    const { error } = await resend.emails.send({
      from: "1up Health Auth <no-reply@potential.xyz>",
      to: "omar@mcadam.io",
      cc: to,
      replyTo: to,
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
  const { error } = await resend.emails.send({
    from: "1up Health Auth <no-reply@potential.xyz>",
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
