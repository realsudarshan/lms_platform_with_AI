import { Header } from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
        
      <div>{children}</div>
      
    </ClerkProvider>
  );
}

export default AppLayout;