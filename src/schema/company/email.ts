import z from 'zod'

export const emailSchema = z.object({
    email: z.string({message: "É necessário digitar um e-mail"}).email("E-mail inválido").max(100,"E-mail muito longo")
})