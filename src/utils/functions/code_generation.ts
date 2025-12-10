/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-empty-function */
export function generateDigits(numberOfDigits: number) {
  if (numberOfDigits <= 0) {
    throw new Error('Number of digits must be greater than 0');
  }

  const min = Math.pow(10, numberOfDigits - 1); // Smallest number with `numberOfDigits`
  const max = Math.pow(10, numberOfDigits); // Largest number with `numberOfDigits`

  return Math.floor(min + Math.random() * (max - min));
}
