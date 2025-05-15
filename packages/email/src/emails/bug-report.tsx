import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

export const BugReportEmail = ({
  message,
  userEmail,
}: {
  message: string;
  userEmail: string;
}) => {
  return (
    <Html>
      <Head />
      <Preview>Bug Report from {userEmail}</Preview>
      <Tailwind>
        <Body>
          <Container>
            <Section className="my-[32px]">
              <Text className="mb-[24px]">
                Yo Omar! someone reported a bug on Potential Health
              </Text>
              <Text className="mb-[24px]">{message}</Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BugReportEmail;
