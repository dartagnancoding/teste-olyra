import "server-only";

import { Resend } from "resend";

import { describeResendError } from "@/features/leads/data/resend-errors";
import {
  welcomeHtml,
  welcomeSubject,
  welcomeText,
} from "@/features/leads/data/welcome-email-template";
import type {
  RedirectNotice,
  WelcomeEmail,
  WelcomeMailer,
} from "@/features/leads/types/welcome-mailer";
import { optionalEnv, requireEnv } from "@/lib/env";

function compose(name: string, notice?: RedirectNotice): WelcomeEmail {
  return {
    subject: welcomeSubject(name),
    html: welcomeHtml(name, notice),
    text: welcomeText(name, notice),
  };
}

export const resendWelcomeMailer: WelcomeMailer = {
  compose,

  async send(name, email) {
    const resend = new Resend(requireEnv("RESEND_API_KEY"));

    // Modo de demonstração: a conta do provedor só entrega no endereço do
    // administrador, então o envio é desviado para lá com uma tarja em vez de
    // falhar. Sem a variável, o lead recebe direto.
    const redirectTo = optionalEnv("MAIL_REDIRECT_TO");
    const notice: RedirectNotice | undefined = redirectTo
      ? { name, email }
      : undefined;

    const { subject, html, text } = compose(name, notice);

    const { error } = await resend.emails.send({
      from: requireEnv("RESEND_FROM"),
      to: redirectTo ?? email,
      subject,
      html,
      text,
    });

    if (!error) return { ok: true };

    console.error("[resend] falha ao enviar boas-vindas", error);

    return { ok: false, message: describeResendError(error.message ?? "") };
  },
};
