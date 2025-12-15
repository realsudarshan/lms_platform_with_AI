import { Header } from "@/components/Header";
import { ClerkProvider } from "@clerk/nextjs";

function AppLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
        <Header/>
      <div>{children}</div>
      
    </ClerkProvider>
  );
}

export default AppLayout;