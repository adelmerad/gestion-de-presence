import { AppShell } from "@/components/AppShell";
import { authEnabled } from "@/lib/auth";

export default function AppLayout({ children }: LayoutProps<"/">) {
  return <AppShell canLogout={authEnabled()}>{children}</AppShell>;
}
