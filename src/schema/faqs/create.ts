import z from 'zod'

export const createFAQSchema = z.object({
    question: z.string({message: "É necessário ter uma pergunta"}).min(5, "Minimo 5 caracteres").max(150, "Máximo 150 caracteres"),
    answer: z.string({message: "É necessário ter uma resposta"}).min(2, "Minimo 2 caracteres").max(300, "Máximo 300 caracteres")
})