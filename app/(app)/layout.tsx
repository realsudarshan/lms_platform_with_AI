import { Header } from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { ClerkProvider } from "@clerk/nextjs";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
        
      <div>{children}</div>
        <SanityLive />
    </ClerkProvider>
  );
}

export default AppLayout;