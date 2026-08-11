import "server-only";

import { describeFailure } from "@/features/leads/application/describe-failure";
import { leadRepository } from "@/features/leads/dependencies.server";
import type { VoidResult } from "@/features/leads/types/results";

export async function deleteLead(id: string): Promise<VoidResult> {
  const result = await leadRepository.remove(id);

  if (!result.ok) return describeFailure(result.failure, "leads.remove");

  return { ok: true };
}
