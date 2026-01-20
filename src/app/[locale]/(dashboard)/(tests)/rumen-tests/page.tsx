"use client";

import { useMemo } from "react";
import type { RumenTest } from "@/shared/types";
import { useI18n } from "@/shared/hooks/use-i18n";
import { useCrud } from "@/shared/hooks/use-crud";
import { DataTable } from "@/shared/components/data-table";
import { Modal } from "@/shared/components/elements/modal";
import { createRumenTestColumns } from "@/entities/rumen-tests";
import { RumenTestForm, RumenTestSchema } from "@/features/rumen-tests";
import { useGetRumenTests } from "@/entities/rumen-tests/services/queries";
import { useCreateRumenTest, useDeleteRumenTest, useUpdateRumenTest } from "@/entities/rumen-tests/services/mutations";
import { QUERY_PARAM_KEYS } from "@/shared/constants";
import { useSearchQueryParams } from "@/shared/hooks/use-query-params";
import { rumenTestValues } from "@/features/rumen-tests/rumen-test.model";

export default function RumenTests() {
  const { t, locale } = useI18n(); 
  const { get, setMany } = useSearchQueryParams();
  
  const newAnimal = get(QUERY_PARAM_KEYS.NEW);
  const animalId = get(QUERY_PARAM_KEYS.ANIMAL_ID, true);

  const { dialog, editedItem, createButton, handleClose, handleDelete, handleEditItem, onSubmit } = useCrud<RumenTest, RumenTestSchema, RumenTestSchema>({
    dialogValue: !!newAnimal,
    createMutation: useCreateRumenTest,
    updateMutation: useUpdateRumenTest,
    removeMutation: useDeleteRumenTest,
    extraOnClose: () => {
      if(!newAnimal) return

      setMany({
        [QUERY_PARAM_KEYS.NEW]: null,
        [QUERY_PARAM_KEYS.ANIMAL_ID]: animalId || null
      })
    }
  });

  const columns = useMemo(() => createRumenTestColumns(handleEditItem, handleDelete, t, locale), [handleEditItem, handleDelete]);

  return (
    <div>
      <DataTable columns={columns} queryFunction={useGetRumenTests} topSlot={createButton(t("rumenTests.createRumenTest"))} />

      <Modal open={dialog} onClose={handleClose} title={t(editedItem ? "rumenTests.editRumenTest" : "rumenTests.createRumenTest")}>
        <RumenTestForm onSubmit={onSubmit} defaultValues={editedItem ? editedItem : animalId ? { ...rumenTestValues, animalId } as any : (undefined as any)} />
      </Modal>
    </div>
  );
}