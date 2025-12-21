import { Header } from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";
import { TutorWidget } from "@/components/tutor";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
        
      <div>{children}</div>
        <SanityLive />
        {/* <TutorWidget /> */}
    </ClerkProvider>
  );
}

export default AppLayout;