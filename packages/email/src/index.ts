import { Resend } from "resend";

import AuthOtpEmail from "./templates/auth-otp";

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
  if (process.env.NODE_ENV === "development") {
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
      case "welcome":
        return {
          content: WelcomeEmail({
            username: (props as WelcomeEmailProps).username,
          }),
          subject: "Welcome 1up 🚀",
        };
      default:
        throw new Error(`Unsupported email type: ${type}`);
    }
  };

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { data, error } = await resend.emails.send({
    from: "Cap Auth <no-reply@auth.cap.so>",
    to,
    subject: fetchTemplate().subject,
    react: fetchTemplate().content,
  });

  return { data, error };
}
