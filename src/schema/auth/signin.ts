import z from 'zod'

export const signinSchema = z.object({
    email: z
        .string({message: "É necessário ter um e-mail"})
        .email("E-mail inválido"),

    password: z
        .string({ message: "Senha obrigatória" })
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .refine((val) => /[a-z]/.test(val), {
          message: "A senha deve conter pelo menos uma letra minúscula",
        })
        .refine((val) => /[A-Z]/.test(val), {
          message: "A senha deve conter pelo menos uma letra maiúscula",
        })
        .refine((val) => /\d/.test(val), {
          message: "A senha deve conter pelo menos um número",
        })
        .refine((val) => /[\W_]/.test(val), {
          message: "A senha deve conter pelo menos um caractere especial",
        })
})