export const onlyDigits = (value: string) => value.replace(/\D/g, "");

export function maskCpf(value: string) {
  const digits = onlyDigits(value).slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}.${digits.slice(3)}`;
  if (digits.length <= 9) {
    return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6)}`;
  }

  return `${digits.slice(0, 3)}.${digits.slice(3, 6)}.${digits.slice(6, 9)}-${digits.slice(9, 11)}`;
}

export function maskCep(value: string) {
  const digits = onlyDigits(value).slice(0, 8);

  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
}

export function maskPhone(value: string) {
  const digits = onlyDigits(value).slice(0, 9);

  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4, 8)}`;
  return `${digits.slice(0, 5)}-${digits.slice(5, 9)}`;
}

export function maskAreaCode(value: string) {
  return onlyDigits(value).slice(0, 2);
}