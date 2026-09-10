import { TutorWidget } from "@/components/tutor";

async function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const hasSanityConfig = Boolean(
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID &&
      process.env.NEXT_PUBLIC_SANITY_DATASET,
  );
  const sanityLive = hasSanityConfig
    ? await import("@/sanity/lib/live")
    : null;

  return (
    <>

      <div>{children}</div>
      {sanityLive ? <sanityLive.SanityLive /> : null}
      <TutorWidget />
    </>
  );
}

export default AppLayout;