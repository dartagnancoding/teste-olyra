import { describe, expect, it } from "vitest";

import { describeResendError } from "@/features/leads/data/resend-errors";

/** Texto real devolvido pela Resend quando não há domínio verificado. */
const SANDBOX_MESSAGE =
  "You can only send testing emails to your own email address (dono@exemplo.com). " +
  "To send emails to other recipients, please verify a domain at resend.com/domains, " +
  "and change the `from` address to an email using this domain.";

describe("describeResendError", () => {
  it("explica o modo de teste em português, sem falar de domínio nem do campo from", () => {
    const message = describeResendError(SANDBOX_MESSAGE);

    expect(message).toContain("modo de teste");
    expect(message).not.toContain("resend.com");
    expect(message).not.toContain("from");
  });

  /**
   * A mensagem do provedor traz o endereço dono da conta. Repassá-la à tela
   * entregaria esse email a qualquer pessoa com acesso ao painel.
   */
  it("não vaza o endereço dono da conta que vem na mensagem original", () => {
    expect(describeResendError(SANDBOX_MESSAGE)).not.toContain("dono@exemplo.com");
  });

  it("diz para tentar de novo quando é excesso de envios", () => {
    expect(describeResendError("Too many requests")).toContain("Tente de novo");
  });

  it("aponta para quem administra quando a credencial é recusada", () => {
    expect(describeResendError("API key is invalid")).toContain("administra");
  });

  it("cai numa frase genérica quando a recusa é desconhecida", () => {
    expect(describeResendError("Something exploded")).toContain("tente novamente");
  });

  it("não devolve mensagem vazia quando o provedor não manda texto", () => {
    expect(describeResendError("").length).toBeGreaterThan(0);
  });

  it("nunca devolve o texto cru do provedor", () => {
    for (const raw of [SANDBOX_MESSAGE, "Too many requests", "API key is invalid", ""]) {
      expect(describeResendError(raw)).not.toBe(raw);
    }
  });
});
