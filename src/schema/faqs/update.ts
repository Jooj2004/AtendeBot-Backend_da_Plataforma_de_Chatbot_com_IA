import z from 'zod'

export const updateFAQSchema = z.object({
    question: z.string({message: "É necessário ter uma pergunta"}).min(5, "Minimo 5 caracteres").max(150, "Máximo 150 caracteres").optional(),
    answer: z.string({message: "É necessário ter uma resposta"}).min(2, "Minimo 2 caracteres").max(300, "Máximo 300 caracteres").optional(),
    id: z.string({message: "ID é obrigatório"}).max(300, "Máximo 300 caracteres")
})