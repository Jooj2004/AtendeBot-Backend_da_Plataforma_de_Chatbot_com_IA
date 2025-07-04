import z from 'zod'

function isValidCNPJ(cnpj: string): boolean {
  cnpj = cnpj.replace(/[^\d]+/g, '');

  if (cnpj.length !== 14) return false;
  if (/^(\d)\1+$/.test(cnpj)) return false;

  const calcCheckDigit = (digits: string, pos: number) => {
    const slice = digits.slice(0, pos);
    const factors = pos === 12
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const sum = slice.split('').reduce((acc, curr, idx) => {
      return acc + parseInt(curr) * factors[idx];
    }, 0);

    const rest = sum % 11;
    return rest < 2 ? '0' : String(11 - rest);
  };

  const digit1 = calcCheckDigit(cnpj, 12);
  const digit2 = calcCheckDigit(cnpj, 13);

  return cnpj.endsWith(digit1 + digit2);
}

export const updateCompanySchema = z.object({
    name: z
        .string({message: "É necessário ter um nome"})
        .min(2, "Mínimo dois caracteres").optional(),

    description: z
        .string()
        .optional(),

    CNPJ: z
        .string({message: "É necessário ter um CNPJ"})
        .min(14, "CNPJ muito curto")
        .max(18, "CNPJ muito longo")
        .refine(isValidCNPJ, {message: "CNPJ inválido"}).optional(),
})