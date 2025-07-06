import z from 'zod'

export const validateQuestion = z.object({
    question: z.string({message:"É necessário ter uma pergunta"}).trim().min(3, "Minímo 3 caracteres").max(150, "Máximo 150 caracteres")
})