import { redirect } from "next/navigation";

import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { isAuthenticated } from "@/features/auth/application/session";
import {
  isMailRedirected,
  PREVIEW_NAME,
  previewWelcomeEmail,
} from "@/features/leads/application/preview-welcome-email";
import { WelcomeEmailPreview } from "@/features/leads/components/welcome-email-preview";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthenticated())) redirect("/login");

  // Montado no servidor: o HTML chega ao client como texto, então nem o
  // template nem a chave do Resend entram no bundle do navegador.
  const email = previewWelcomeEmail();

  return (
    <>
      <Header
        actions={
          <WelcomeEmailPreview
            subject={email.subject}
            html={email.html}
            previewName={PREVIEW_NAME}
            isRedirected={isMailRedirected()}
          />
        }
      />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-14">
        {children}
      </main>
      <Footer />
    </>
  );
}
