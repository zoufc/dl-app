/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
export function expirationDate(minutes: number) {
  const expirationDate = new Date(Date.now() + minutes * 60 * 1000);
  return expirationDate;
}

export function isCodeExpired(expirationDate: Date) {
  return expirationDate.getTime() <= Date.now();
}
