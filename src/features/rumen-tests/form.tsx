import { useForm } from "react-hook-form";
import { useI18n } from "@/shared/hooks/use-i18n";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import { AnimalSelect } from "../animals/components/animal-select";
import { DiseaseSelect } from "../diseases/components/disease-select";
import { RumenTestSchema, createRumenTestSchema, rumenTestValues } from "./rumen-test.model";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/shared/components/ui/form";

interface RumenTestFormProps {
  defaultValues?: RumenTestSchema;
  onSubmit: (values: RumenTestSchema) => void;
}

export function RumenTestForm({ onSubmit, defaultValues }: RumenTestFormProps) {
  const { t } = useI18n();

  const form = useForm<RumenTestSchema>({
    resolver: zodResolver(createRumenTestSchema(t)) as any,
    defaultValues: defaultValues || (rumenTestValues as any),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4 h-full">
        <FormField
          name="animalId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.animal")}</FormLabel>
              <FormControl>
                <AnimalSelect placeholder={t("form.animal")} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="diseaseId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("form.disease")}</FormLabel>
              <FormControl>
                <DiseaseSelect placeholder={t("form.disease")} value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="date"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 pt-1.5">
              <FormLabel>{t("form.date")}</FormLabel>
              <FormControl>
                <Input type="datetime-local" placeholder={t("form.date")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="infusoriaCount"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 pt-1.5">
              <FormLabel>{t("rumenTests.infusoriaCount")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder={t("rumenTests.infusoriaCount")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="scarFluidState"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex flex-col gap-1 pt-1.5">
              <FormLabel>{t("rumenTests.scarFluidState")}</FormLabel>
              <FormControl>
                <Input type="number" step="0.01" placeholder={t("rumenTests.scarFluidState")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="conclusion"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("inspections.conclusion")}</FormLabel>
              <FormControl>
                <Textarea rows={6} className="resize-none" placeholder={t("inspections.conclusion")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex-1 flex items-end">
          <Button disabled={form.formState.isSubmitting} type="submit" className="w-full">
            {t(form.formState.isSubmitting ? "form.submitting" : "form.submit")}
          </Button>
        </div>
      </form>
    </Form>
  );
}