import * as React from "react";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const AuthOtpEmail = ({ otpCode }: { otpCode: string }) => {
  return (
    <Html>
      <Head />
      <Preview>Your 1up verification code: {otpCode}</Preview>
      <Tailwind>
        <Body className="bg-[#111110] font-serif">
          <Container className="mx-auto my-[40px] w-full max-w-[600px] rounded-[8px] bg-[#222221] p-[24px] text-center">
            <Section className="text-center">
              <Img
                src="https://picsum.photos/120/120"
                alt="1up Logo"
                width="120"
                height="120"
                className="mx-auto my-[16px]"
              />
              <Heading className="my-[16px] font-serif text-[32px] font-bold text-[#e5484d]">
                1up Health
              </Heading>
            </Section>

            <Section className="my-[32px]">
              <Text className="mb-[24px] font-serif text-[16px] text-[#eeeeec]">
                Your 1up verification code
              </Text>

              <Section className="my-[32px] text-center">
                <Container className="mx-auto max-w-[300px] rounded-[8px] border-[2px] border-dashed border-[#e5484d] bg-[#2a2a28] px-[24px] py-[16px]">
                  <div className="text-center" style={{ marginLeft: "1.5em" }}>
                    <Text
                      className="m-0 inline-block font-serif text-[32px] font-bold text-[#e5484d]"
                      style={{
                        letterSpacing: "0.5em",
                        lineHeight: "3",
                      }}
                    >
                      {otpCode}
                    </Text>
                  </div>
                </Container>
              </Section>

              <Text className="mb-[24px] font-serif text-[14px] text-[#b5b3ad]">
                This code will expire in 5 minutes.
              </Text>

              <Text className="mb-[24px] font-serif text-[12px] text-[#7c7b74]">
                If you didn't request this code, you can safely ignore this
                email.
              </Text>

              <Text className="mb-[24px] font-serif text-[16px] text-[#eeeeec]">
                Level up your health journey!
              </Text>

              <Text className="mb-[8px] font-serif text-[16px] text-[#eeeeec]">
                The 1up Team
              </Text>
            </Section>

            <Section className="mt-[32px] border-t-[1px] border-[#2a2a28] pt-[24px]">
              <Text className="m-0 font-serif text-[14px] text-[#b5b3ad]">
                © {new Date().getFullYear()} 1up - Unproprietary Corporation.
                All rights reserved.
              </Text>
              {/* <Text className="m-0 font-serif text-[14px] text-[#eeeeec]">
                Torstraße 123, 10119 Berlin, Germany
              </Text> */}
              {/* <Text className="mt-[16px] font-serif text-[14px] text-[#eeeeec]">
                <Link href="#" className="text-[#e5484d] underline">
                  Unsubscribe
                </Link>{" "}
                •{" "}
                <Link href="#" className="text-[#e5484d] underline">
                  Privacy Policy
                </Link>{" "}
                •{" "}
                <Link href="#" className="text-[#e5484d] underline">
                  Terms of Service
                </Link>
              </Text> */}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default AuthOtpEmail;
