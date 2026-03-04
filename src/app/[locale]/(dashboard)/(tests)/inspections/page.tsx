"use client";

import { useMemo } from "react";
import type { Inspection } from "@/shared/types";
import { useI18n } from "@/shared/hooks/use-i18n";
import { useCrud } from "@/shared/hooks/use-crud";
import { QUERY_PARAM_KEYS } from "@/shared/constants";
import { DataTable } from "@/shared/components/data-table";
import { Modal } from "@/shared/components/elements/modal";
import { createInspectionColumns } from "@/entities/inspections";
import { useSearchQueryParams } from "@/shared/hooks/use-query-params";
import { InspectionForm, InspectionSchema, inspectionValues } from "@/features/inspections";
import { useGetInspections } from "@/entities/inspections/services/queries";
import { useCreateInspection, useDeleteInspection, useUpdateInspection } from "@/entities/inspections/services/mutations";

export default function Inspections() {
  const { t, locale } = useI18n();
  const { get, setMany } = useSearchQueryParams();

  const newAnimal = get(QUERY_PARAM_KEYS.NEW);
  const animalId = get(QUERY_PARAM_KEYS.ANIMAL_ID, true);

  const { dialog, editedItem, createButton, handleClose, handleDelete, handleEditItem, onSubmit } = useCrud<Inspection, InspectionSchema, InspectionSchema>({
    dialogValue: !!newAnimal,
    createMutation: useCreateInspection,
    updateMutation: useUpdateInspection,
    removeMutation: useDeleteInspection,
    extraOnClose: () => {
      if (!newAnimal) return;

      setMany({
        [QUERY_PARAM_KEYS.NEW]: null,
        [QUERY_PARAM_KEYS.ANIMAL_ID]: animalId || null,
      });
    },
  });

  const columns = useMemo(() => createInspectionColumns(handleEditItem, handleDelete, t, locale), [handleEditItem, handleDelete]);

  return (
    <div>
      <DataTable columns={columns} queryFunction={useGetInspections} topSlot={createButton(t("inspections.createInspection"))} />

      <Modal open={dialog} onClose={handleClose} title={t(editedItem ? "inspections.editInspection" : "inspections.createInspection")}>
        <InspectionForm
          type="MORNING"
          onSubmit={onSubmit}
          hideAnimals={!!animalId}
          defaultValues={editedItem ? editedItem : (animalId ? ({ ...inspectionValues, animalId } as any) : (undefined as any))}
        />
      </Modal>
    </div>
  );
}
