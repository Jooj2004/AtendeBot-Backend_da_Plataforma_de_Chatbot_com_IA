import z from 'zod'

export const createFAQSchema = z.object({
    question: z.string({message: "É necessário ter uma pergunta"}).min(10, "Minimo 10 caracteres"),
    answer: z.string({message: "É necessário ter uma resposta"}).min(2, "Minimo 2 caracteres")
})