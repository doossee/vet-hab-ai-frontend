import { useMemo, useState, useEffect } from "react";
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
import { Button } from "@/shared/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/components/ui/popover";
import { useGetLastRumenTest } from "@/entities/rumen-tests/services/queries";
import { cn } from "@/shared/lib/utils";

type Props = {
  id: number;
}

const clinicExamFields = [
  'temperature',
  'pulse',
  'respiratoryRate',
  'rumination'
]

const rumenTestFields = [
  'infusoriaCount',
  'scarFluidState',
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
  const { data: rumenData } = useGetLastRumenTest(animalId);
  const { data: bloodData } = useGetLastGeneralBloodTest(animalId);
  const { data: bloodSerumData } = useGetLastBloodSerumTest(animalId);
  const params: number[] = [];

  const clinicValues = clinicExamFields.reduce((acc, field) => {
    if (clinicData?.inspection && field in (clinicData?.inspection ?? {})) {
      const v = clinicData.inspection[field as keyof GeneralInspection['inspection']];
      params.push(v);
      acc[field] = clinicData.inspection[field as keyof GeneralInspection['inspection']];
    }
    return acc;
  }, {} as Record<string, any>);
  
  const bloodValues = bloodExamFields.reduce((acc, field) => {
    if (bloodData && field in (bloodData ?? {})) {
      const v = bloodData[field as keyof GeneralBloodTest];
      params.push(v);
      acc[field] = bloodData[field as keyof GeneralBloodTest];
    }
    return acc;
  }, {} as Record<string, any>);

  const bloodSerumValues = bloodExamSerumFields.reduce((acc, field) => {
    if (bloodSerumData && field in (bloodSerumData ?? {})) {
      const v = bloodSerumData[field as keyof BloodSerumTest];
      params.push(v);
      acc[field] = bloodSerumData[field as keyof BloodSerumTest];
    }
    return acc;
  }, {} as Record<string, any>);

  const rumenValues = rumenTestFields.reduce((acc, field) => {
    if (rumenData && field in (rumenData ?? {})) {
      const v = rumenData[field as keyof GeneralInspection['inspection']];
      params.push(v);
      acc[field] = rumenData[field as keyof GeneralInspection['inspection']];
    }
    return acc;
  }, {} as Record<string, any>);

  return { ...clinicValues, ...bloodValues, ...rumenValues, ...bloodSerumValues, params };
}

const namesObject = {
  // Clinic Exam
  temperature: { ru: 'Температура', uz: 'Harorat', unit_ru: '°C', unit_uz: '°C' },
  pulse: { ru: 'Пульс', uz: 'Puls', unit_ru: 'уд/мин', unit_uz: 'zrb/min' },
  respiratoryRate: { ru: 'Частота дыхания', uz: 'Nafas soni', unit_ru: 'раз/мин', unit_uz: 'mrt/min' },
  rumination: { ru: 'Руминация', uz: 'Ruminatsiya', unit_ru: 'раз/мин', unit_uz: 'mrt/2min' },
  // rumenInfusoriaCount: { ru: 'Количество инфузорий в рубце', uz: 'Qorindagi infuzoriyalar soni', unit_uz: '', unit_ru: '' },
  // rumenFluidState: { ru: 'Состояние рубцовой жидкости', uz: 'Qorin suyuqligi holati', unit_ru: '', unit_uz: '' },

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

  infusoriaCount: { ru: 'Количество инфузорий в рубце', uz: 'Qorindagi infuzoriyalar soni', unit_uz: '(1000/мл)', unit_ru: '(1000/мл)' },
  scarFluidState: { ru: 'Состояние рубцовой жидкости', uz: 'Qorin suyuqligi holati', unit_ru: '(pH)', unit_uz: '(pH)' },
};

const diseaseNames = {
  "2 Osteodistrafiya": { ru: 'Остеодистрофия', uz: 'Osteodistrofiya' },
  "Osteodistrafiya": { ru: 'Остеодистрофия', uz: 'Osteodistrofiya' },
  "Gipomikro": { ru: 'Гипомикроз', uz: 'Gipomikroz' },
  "Healthy": { ru: 'Здоровый', uz: 'Sog\'lom' },
  "Ketos": { ru: 'Кетоз', uz: 'Ketoz' },
};

export function PredictInfoTable({ id }: Props) {
  const { t, locale } = useI18n();
  const { params, ...values } = useExamValues(id);

  const isEnabledToGetPredict = params.length === 17 && params.every(param => typeof param === 'number');

  const { data, isLoading } = useGetAnimalPredict(id, { params }, isEnabledToGetPredict);

  const topDisease = useMemo<{title: string, percent: number, key: string}>(() => {
    if (!data) return { title: '', percent: 0, key: '' };
    const entries = Object.entries(data.data);
    if (!entries.length) return { title: '', percent: 0, key: '' };
    const [key, value] = entries.reduce((max, current) => current[1] > max[1] ? current : max);
    const diseaseKey = key;
    const name = diseaseNames[diseaseKey as keyof typeof diseaseNames];
    return {
      key: diseaseKey,
      title: name ? name[locale] : diseaseKey,
      percent: parseFloat((value * 100).toFixed(2))
    };
  }, [data, locale]);

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 768);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

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
              {t("mostLikelyDisease")}
            </p>
            <p className={cn("text-lg font-semibold", topDisease.key === "Healthy" ? 'text-green-600' : 'text-red-600')}>
              {topDisease.title??"-"} — {topDisease.percent??0}%
            </p>
            <div className="mt-2 grid md:grid-cols-2 gap-1 pt-2 border-t">
              {Object.entries(data.data)
                .filter(([key, _]) => key !== topDisease.key)
                .sort(([,a], [,b]) => b - a)
                .map(([key, value]) => {
                  const name = diseaseNames[key as keyof typeof diseaseNames];
                  const title = name ? name[locale] : key;
                  const percent = parseFloat((value * 100).toFixed(2));
                  return (
                    <div key={key}>
                      <span className="font-medium">{title}</span>: {percent}%
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-4 gap-x-3">
            {isSmallScreen ? (
              Object.entries(namesObject).map(([key, nameObj]) => {
                const value = values[key as keyof typeof values];
                return (
                  <div className="" key={key}>
                    <h2 className="text-xs text-muted-foreground">{nameObj[locale]}</h2>
                    <p className="font-medium text-xl">
                      {value ?? '-'}{" "}
                      <span className="text-xs">{nameObj[`unit_${locale}`]}</span>
                    </p>
                  </div>
                );
              })
            ) : (() => {
              const entries = Object.entries(namesObject);
              const firstNine = entries.slice(0, 9);
              const rest = entries.slice(9);
              return (
                <>
                  {firstNine.map(([key, nameObj]) => {
                    const value = values[key as keyof typeof values];
                    return (
                      <div className="" key={key}>
                        <h2 className="text-xs text-muted-foreground">{nameObj[locale]}</h2>
                        <p className="font-medium text-xl">
                          {value ?? '-'}{" "}
                          <span className="text-xs">{nameObj[`unit_${locale}`]}</span>
                        </p>
                      </div>
                    );
                  })}
                  {rest.length > 0 && (
                    <div className="flex items-center justify-center">
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <div className="h-full w-full flex items-end justify-start cursor-pointer" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>...</div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
                          <div className="grid grid-cols-2 gap-4">
                            {rest.map(([key, nameObj]) => {
                              const value = values[key as keyof typeof values];
                              return (
                                <div key={key}>
                                  <h3 className="text-xs text-muted-foreground">{nameObj[locale]}</h3>
                                  <p className="font-medium">
                                    {value ?? '-'}{" "}
                                    <span className="text-xs">{nameObj[`unit_${locale}`]}</span>
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </>}
      </CardContent>
    </Card>
  )
}