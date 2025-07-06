import { prisma } from "../libs/prisma"

export const createChatContext = () => {
    const prompt = " "
}

export const createInteractionServ = async (question: string, botAnswer: string, companyId: string) => {
    const interaction = await prisma.interaction.create({
        data:{
            question,
            botAnswer,
            companyId
        }
    })
    return interaction
}