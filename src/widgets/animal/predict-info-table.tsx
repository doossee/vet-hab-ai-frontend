import { useMemo } from "react";
import { LineChart } from "lucide-react";

import { useGetAnimalPredict } from "@/entities/animals/services/animal-queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { EmptyState } from "@/shared/components/empty-state";
import { BloodSerumTest, GeneralBloodTest, GeneralInspection } from "@/shared/types";
import { useGetLastGeneralInspection } from "@/entities/general-inspections/services/queries";
import { useGetLastGeneralBloodTest } from "@/entities/general-blood-tests/services/queries";
import { useI18n } from "@/shared/hooks/use-i18n";
import { BLOOD_TEST_FIELDS } from "@/shared/constants/index";
import { useGetLastBloodSerumTest } from "@/entities/blood-serum-tests/services/queries";

type Props = {
  id: number;
}

const clinicExamFields = [
  'temperature',
  'pulse',
  'respiratoryRate',
  'rumination',
  'rumenFluidState',
  'rumenInfusoriaCount',
]

const bloodExamFields = [
  "erythrocyteCount",
  "hemoglobin",
]

const bloodExamSerumFields = [
  'totalProtein',
  'totalCalcium',
  'organicPhosphorus',
  'glucose',
  'alkalineReserve',
  'copper',
  'cobalt',
  'manganese',
  'zinc',
]

function useExamValues(animalId: number) {
  const { data: clinicData } = useGetLastGeneralInspection(animalId);
  // const { data: clinicData } = useGetLastGeneralInspection(animalId);
  const { data: bloodData } = useGetLastGeneralBloodTest(animalId);
  const { data: bloodSerumData } = useGetLastBloodSerumTest(animalId);

  const clinicValues = clinicExamFields.reduce((acc, field) => {
    if (clinicData?.inspection && field in clinicData.inspection) {
      acc[field] = clinicData.inspection[field as keyof GeneralInspection['inspection']];
    }
    return acc;
  }, {} as Record<string, any>);

  const bloodValues = bloodExamFields.reduce((acc, field) => {
    if (bloodData && field in bloodData) {
      acc[field] = bloodData[field as keyof GeneralBloodTest];
    }
    return acc;
  }, {} as Record<string, any>);

  const bloodSerumValues = bloodExamSerumFields.reduce((acc, field) => {
    if (bloodSerumData && field in bloodSerumData) {
      acc[field] = bloodSerumData[field as keyof BloodSerumTest];
    }
    return acc;
  }, {} as Record<string, any>);

  return { ...bloodValues, ...bloodSerumValues, ...clinicValues };
}

const namesObject = {
  // Clinic Exam
  temperature: { ru: 'Температура', uz: 'Harorat', unit_ru: '°C', unit_uz: '°C' },
  pulse: { ru: 'Пульс', uz: 'Puls', unit_ru: 'уд/мин', unit_uz: 'zrb/min' },
  respiratoryRate: { ru: 'Частота дыхания', uz: 'Nafas soni', unit_ru: 'раз/мин', unit_uz: 'mrt/min' },
  rumination: { ru: 'Жвачка', uz: 'Жвачка', unit_ru: 'раз/мин', unit_uz: 'mrt/min' },
  rumenInfusoriaCount: { ru: 'Количество инфузорий в рубце', uz: 'Qorindagi infuzoriyalar soni', unit_uz: '', unit_ru: '' },
  rumenFluidState: { ru: 'Состояние рубцовой жидкости', uz: 'Qorin suyuqligi holati', unit_ru: '', unit_uz: '' },

  // Blood Exam
  erythrocyteCount: BLOOD_TEST_FIELDS.erythrocyteCount,
  hemoglobin: BLOOD_TEST_FIELDS.hemoglobin,
  totalProtein: BLOOD_TEST_FIELDS.totalProtein,
  totalCalcium: BLOOD_TEST_FIELDS.totalCalcium,
  organicPhosphorus: BLOOD_TEST_FIELDS.organicPhosphorus,
  glucose: BLOOD_TEST_FIELDS.glucose,
  alkalineReserve: BLOOD_TEST_FIELDS.alkalineReserve,
  copper: BLOOD_TEST_FIELDS.copper,
  cobalt: BLOOD_TEST_FIELDS.cobalt,
  manganese: BLOOD_TEST_FIELDS.manganese,
  zinc: BLOOD_TEST_FIELDS.zinc,
};

const diseaseNames = {
  Osteodistrafiya: { ru: 'Остеодистрофия', uz: 'Osteodistrofiya' },
  Gipomikro: { ru: 'Гипомикроз', uz: 'Gipomikroz' },
  Healthy: { ru: 'Здоровый', uz: 'Sog\'lom' },
  Ketos: { ru: 'Кетоз', uz: 'Ketoz' },
};

export function PredictInfoTable({ id }: Props) {
  const { t, locale } = useI18n();
  const values = useExamValues(id);
  const params = Object.values(values)
  console.log(values, params);
  const { data, isLoading } = useGetAnimalPredict(id, { params }, false);

  const topDisease = useMemo<{title: string, percent: number}>(() => {
    if (!data) return { title: '', percent: 0 };
    const entries = Object.entries(data);
    if (!entries.length) return { title: '', percent: 0 };
    const [key, value] = entries.reduce((max, current) => current[1] > max[1] ? current : max);
    const diseaseKey = key.replace(/^\d+_/, ''); // Remove prefix like "2_"
    const name = diseaseNames[diseaseKey as keyof typeof diseaseNames];
    return {
      title: name ? name[locale] : diseaseKey,
      percent: parseFloat((value * 100).toFixed(2))
    };
  }, [data, locale]);

  return (
    <Card className="shadow-none rounded">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm md:text-base">
            {t("aiPredictionResult")}
          </CardTitle>

        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {!isLoading && !data && <EmptyState />}
        {isLoading && (
          <>
            <div className="h-18 w-full bg-card-foreground/5 rounded animate-pulse" />
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4 mt-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-2 animate-pulse">
                  <div className="h-3 w-3/4 bg-card-foreground/25 rounded"></div> {/* название */}
                  <div className="h-6 w-full bg-card-foreground/15 rounded"></div>   {/* значение */}
                </div>
              ))}
            </div>
          </>
        )}
        {data && <>
          <div className="mb-4 rounded-lg border bg-card-foreground/5 p-3">
            <p className="text-sm">
              {t("pages.mostLikelyDisease")}
            </p>
            <p className="text-lg font-semibold">
              {topDisease.title??"-"} — {topDisease.percent??0}%
            </p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-4">
            { Object.entries(values??{}).map(([key, value]) => 
              <div className="" key={key}>
                <h2 className="text-xs text-muted-foreground">{namesObject[key as keyof typeof namesObject]?.[locale]}</h2>
                <p className="font-medium text-xl">
                  {value}{" "}
                  <span className="text-xs">{namesObject[key as keyof typeof namesObject]?.[`unit_${locale}`] ?? ''}</span>
                </p>
              </div>
            )}
            <div className="h-full w-full flex items-end text-muted-foreground">
              .....
            </div>
          </div>
        </>}
      </CardContent>
    </Card>
  )
}