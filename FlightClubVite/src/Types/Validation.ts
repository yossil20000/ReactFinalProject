export type Inputs = {
  date_from: Date | undefined,
  date_to: Date | undefined,
}
export type validationError = Partial<Record<keyof Inputs,string>>