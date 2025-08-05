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
  orgName: string
  inviterName: string
  inviterEmail: string
  acceptUrl: string
  expiresAt: string
}

export const InvitationEmail = async ({
  orgName,
  inviterName,
  inviterEmail,
  acceptUrl,
  expiresAt,
}: Props) => {
  const t = await getTranslations()

  return (
    <Html>
      <Head />
      <Preview>{t("You're invited to join {orgName}", { orgName })}</Preview>
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
                {t("You're invited to join {orgName}", { orgName })}
              </Heading>
            </Section>

            {/* Content */}
            <Section className="rounded-lg border border-border bg-card p-8">
              <Text className="mb-4 text-base text-card-foreground">
                {t("Hello")},
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t("{inviterName} has invited you to join {orgName}", {
                  inviterName,
                  orgName,
                })}
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t(
                  "Click the button below to accept the invitation and join the organization"
                )}
                :
              </Text>

              <Section className="my-6 text-center">
                <Button
                  className="cursor-pointer rounded-md border-none bg-primary px-6 py-3 text-base font-semibold text-primary-foreground no-underline"
                  href={acceptUrl}
                >
                  {t("Accept Invitation")}
                </Button>
              </Section>

              <Text className="mb-4 text-base text-card-foreground">
                <strong>{t("Important")}:</strong>{" "}
                {t("This invitation will expire on {date}", {
                  date: new Date(expiresAt).toLocaleDateString(),
                })}
                .
              </Text>

              <Text className="mb-4 text-base text-card-foreground">
                {t(
                  "If you're having trouble clicking the button, copy and paste this link into your browser"
                )}
                :
              </Text>
              <Text className="my-2 break-all text-sm text-primary">
                {acceptUrl}
              </Text>
            </Section>

            {/* Footer */}
            <Section className="mt-8 border-t border-border pt-6">
              <Text className="m-0 text-sm text-muted-foreground">
                {t("This invitation was sent by {email}", {
                  email: inviterEmail,
                })}
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
