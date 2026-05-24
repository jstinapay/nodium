import Image from "next/image";
import Link from "next/link";
import type React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const integrationRows = [
  {
    id: "ai-and-communication",
    logos: [
      { name: "Gemini", src: "/logos/gemini.svg" },
      { name: "Google", src: "/logos/google.svg" },
      { name: "Slack", src: "/logos/slack.svg" },
      { name: "Discord", src: "/logos/discord.svg" },
      { name: "GitHub", src: "/logos/github.svg" },
      { name: "OpenAI", src: "/logos/openai.svg" },
    ],
  },
  {
    id: "workflows-and-payments",
    reverse: true,
    logos: [
      { name: "Stripe", src: "/logos/stripe.svg" },
      { name: "Google Forms", src: "/logos/googleform.svg" },
      { name: "Gemini", src: "/logos/gemini.svg" },
      { name: "Google", src: "/logos/google.svg" },
      { name: "Slack", src: "/logos/slack.svg" },
      { name: "Discord", src: "/logos/discord.svg" },
    ],
  },
  {
    id: "productivity",
    logos: [
      { name: "Google", src: "/logos/google.svg" },
      { name: "OpenAI", src: "/logos/openai.svg" },
      { name: "GitHub", src: "/logos/github.svg" },
      { name: "Stripe", src: "/logos/stripe.svg" },
      { name: "Google Forms", src: "/logos/googleform.svg" },
      { name: "Gemini", src: "/logos/gemini.svg" },
    ],
  },
];

export default function IntegrationsSection() {
  return (
    <section id="customers">
      <div className="bg-muted py-24 dark:bg-background md:py-32">
        <div className="mx-auto max-w-5xl px-6">
          <div className="bg-muted/25 relative mx-auto max-w-[22rem] items-center justify-between space-y-6 overflow-hidden py-2 [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] sm:max-w-md">
            <div
              role="presentation"
              className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,var(--color-border)_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:32px_32px] opacity-50"
            />

            {integrationRows.map((row) => (
              <LogoRow key={row.id} logos={row.logos} reverse={row.reverse} />
            ))}

            <div className="absolute inset-0 m-auto flex size-fit justify-center gap-2">
              <IntegrationCard
                className="shadow-black-950/10 size-16 bg-white/25 shadow-xl backdrop-blur-md backdrop-grayscale dark:border-white/10 dark:shadow-white/15"
                isCenter
              >
                <IntegrationLogo name="Nodium" src="/logos/logo.svg" />
              </IntegrationCard>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-lg space-y-6 text-center">
            <h2 className="text-balance text-3xl font-semibold md:text-4xl">
              Integrate with your favorite tools
            </h2>
            <p className="text-muted-foreground">
              Connect seamlessly with popular platforms and services to enhance
              your workflow.
            </p>

            <Button variant="outline" size="sm" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

const LogoRow = ({
  logos,
  reverse = false,
}: {
  logos: Array<{ name: string; src: string }>;
  reverse?: boolean;
}) => {
  const rowLogos = reverse ? [...logos].reverse() : logos;
  const marqueeLogos = [
    ...rowLogos.map((logo) => ({ ...logo, key: `${logo.src}-first` })),
    ...rowLogos
      .slice(1)
      .map((logo) => ({ ...logo, key: `${logo.src}-second` })),
    { ...rowLogos[0], key: `${rowLogos[0].src}-second` },
  ];

  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          "flex w-max gap-6 integration-marquee",
          reverse && "integration-marquee-reverse",
        )}
      >
        {marqueeLogos.map((logo) => (
          <IntegrationCard key={logo.key}>
            <IntegrationLogo name={logo.name} src={logo.src} />
          </IntegrationCard>
        ))}
      </div>
    </div>
  );
};

const IntegrationLogo = ({ name, src }: { name: string; src: string }) => {
  return (
    <Image
      src={src}
      alt={name}
      width={32}
      height={32}
      className="size-5 object-contain"
    />
  );
};

const IntegrationCard = ({
  children,
  className,
  isCenter = false,
}: {
  children: React.ReactNode;
  className?: string;
  isCenter?: boolean;
}) => {
  return (
    <div
      className={cn(
        "relative z-20 flex size-12 shrink-0 rounded-full border bg-background shadow-sm dark:border-white/10 dark:bg-white/[0.04]",
        className,
      )}
    >
      <div className={cn("m-auto size-fit *:size-5", isCenter && "*:size-8")}>
        {children}
      </div>
    </div>
  );
};
