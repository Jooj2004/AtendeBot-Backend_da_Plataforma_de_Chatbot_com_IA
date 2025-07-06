import z from 'zod'

export const editPasswordSchema = z.object({
    id: z.string(),

    actualPass: z
        .string({ message: "Senha obrigatória" })
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(100, "A antiga senha deve ter no máximo 100 caracteres")
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
        }),
        
    newPass: z
        .string({ message: "Senha obrigatória" })
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .max(100, "A nova senha deve ter no máximo 100 caracteres")
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