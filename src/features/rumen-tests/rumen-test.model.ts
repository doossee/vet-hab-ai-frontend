import { z } from "zod";

export const rumenTestValues = {
  animalId: null,
  diseaseId: null,
  date: new Date().toISOString(),
  conclusion: "",
  infusoriaCount: 0,
  scarFluidState: 0,
};

export const createRumenTestSchema = (t: any) =>
  z.object({
    animalId: z.number({
      required_error: t("required.animalRequired"),
      invalid_type_error: t("required.animalRequired"),
    }),
    diseaseId: z.number().nullable().optional(),
    date: z.string().min(1, t("required.dateRequired")),
    conclusion: z.string().optional(),
    infusoriaCount: z.coerce.number().min(0, t("required.infusoriaCountGreetThan0")),
    scarFluidState: z.coerce.number().min(0, t("required.scarFluidStateGreetThan0")),
  });

export type RumenTestSchema = z.infer<ReturnType<typeof createRumenTestSchema>>;