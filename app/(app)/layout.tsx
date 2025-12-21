import { TutorWidget } from "@/components/tutor";
import { SanityLive } from "@/sanity/lib/live";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>

      <div>{children}</div>
      <SanityLive />
      <TutorWidget />
    </>
  );
}

export default AppLayout;