import { predictApiInstance } from './api-instance';

type PredictResponse = {
  "2_Osteodistrafiya": number
  "Gipomikro": number
  "Healthy": number
  "Ketos": number
  "Osteodistrafiya": number
}

export function getPredict(body: {params: number[]}) {
  return predictApiInstance.post<PredictResponse>('/predict_v2', body)
}
