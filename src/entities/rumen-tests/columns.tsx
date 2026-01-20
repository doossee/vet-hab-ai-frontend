import { Edit, Trash } from "lucide-react";
import { RumenTest, LanguageLocales } from "@/shared/types";
import { Button } from "@/shared/components/ui/button";

export const createRumenTestColumns = (handleEditItem: (item: RumenTest) => void, handleDelete: (id: number) => void, t: any, locale: LanguageLocales) => [
  {
    title: t("form.animal"),
    key: "animal",
    render(item: RumenTest) {
      return <span className="text-right">{item.animal?.nameOrCode ?? "-"}</span>;
    },
  },
  {
    title: t("form.disease"),
    key: "disease",
    render(item: RumenTest) {
      return <span className="text-right">{`${new Date(item.disease?.startTime!).toLocaleDateString()}-${new Date(String(item.disease?.endTime)).toLocaleDateString()}`}</span>;
    },
  },
  {
    title: t("form.date"),
    key: "date",
    render(item: RumenTest) {
      return <span className="text-right">{new Date(item.createdAt).toLocaleDateString(locale)}</span>;
    },
  },
  { title: t("rumenTests.infusoriaCount"), key: "infusoriaCount" },
  { title: t("rumenTests.scarFluidState"), key: "scarFluidState" },
  {
    title: t("inspections.conclusion"),
    key: "conclusion",
    render(item: RumenTest) {
      return <span className="text-right">{item.conclusion ?? "-"}</span>;
    },
  },
  {
    title: t("table.actions"),
    key: "actions",
    render(item: RumenTest) {
      return (
        <div className="flex gap-2 items-center flex-wrap md:flex-nowrap justify-end md:justify-start">
          <Button onClick={() => handleEditItem(item)} size="sm" className="text-xs!">
            <Edit />
            {t("table.edit")}
          </Button>
          <Button onClick={() => handleDelete(item.id)} size="sm" className="text-xs!" variant={"destructive"}>
            <Trash />
            {t("table.delete")}
          </Button>
        </div>
      );
    },
  },
];