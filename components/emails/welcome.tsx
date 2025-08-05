import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"
import { getTranslations } from "next-intl/server"

type Props = {
  displayName: string
  email: string
  orgName: string
  loginUrl: string
}

export const WelcomeEmail = async ({
  displayName,
  email,
  orgName,
  loginUrl,
}: Props) => {
  const t = await getTranslations()

  return (
    <Html>
      <Head />
      <Preview>{t("Welcome to {orgName}!", { orgName })}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                primary: {
                  DEFAULT: "#2e6f40",
                  foreground: "#ffffff",
                },
                secondary: {
                  DEFAULT: "#e3e8e4",
                  foreground: "#000000",
                },
                muted: {
                  DEFAULT: "#f2f4f1",
                  foreground: "#666666",
                },
                border: "#c8dacd",
                background: "#ffffff",
                foreground: "#1a1a1a",
                card: {
                  DEFAULT: "#ffffff",
                  foreground: "#262626",
                },
              },
              borderRadius: {
                lg: "12px", // 0.75rem
                md: "10px", // calc(0.75rem - 2px)
                sm: "8px", // calc(0.75rem - 4px)
              },
            },
          },
        }}
      >
        <Body className="bg-muted font-sans leading-relaxed text-foreground">
          <Container className="mx-auto max-w-2xl p-5">
            {/* Header */}
            <Section className="mb-8 rounded-lg border border-border bg-card p-8 text-center">
              <Heading className="m-0 text-2xl font-bold text-card-foreground">
                {t("Welcome to {orgName}!", { orgName })}
              </Heading>
            </Section>

            {/* Content */}
            <Section className="rounded-lg border border-border bg-card p-8">
              <Text className="mb-4 text-base text-card-foreground">
                {t("Hello {displayName}", { displayName })},
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t("Welcome to {orgName}! We're excited to have you on board", {
                  orgName,
                })}
                .
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t(
                  "Your account has been successfully created and you now have access to all the features of our ERP system"
                )}
                .{" "}
                {t(
                  "We've set up a demo organization with sample data to help you get started"
                )}
                .
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t("Here's what you can do to get started:")}
              </Text>

              <Text className="mb-2 text-base text-card-foreground">
                • {t("Explore your dashboard to see key metrics and insights")}
              </Text>
              <Text className="mb-2 text-base text-card-foreground">
                • {t("Create and manage products, customers, and suppliers")}
              </Text>
              <Text className="mb-2 text-base text-card-foreground">
                • {t("Generate invoices and track payments")}
              </Text>
              <Text className="mb-2 text-base text-card-foreground">
                • {t("Manage your inventory and cash register")}
              </Text>

              <Section className="my-6 text-center">
                <Button
                  className="cursor-pointer rounded-md border-none bg-primary px-6 py-3 text-base font-semibold text-primary-foreground no-underline"
                  href={loginUrl}
                >
                  {t("Get Started")}
                </Button>
              </Section>

              <Text className="mb-4 text-base text-card-foreground">
                {t(
                  "If you have any questions or need assistance, don't hesitate to reach out to our support team"
                )}
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t("Best regards,")}
                <br />
                {t("The {orgName} Team", { orgName })}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 border-t border-border pt-6">
              <Text className="m-0 text-sm text-muted-foreground">
                {t("This email was sent to {email}", { email })}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
