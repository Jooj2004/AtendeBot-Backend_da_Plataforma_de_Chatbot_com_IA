import { prisma } from "../libs/prisma"

export const createInteractionServ = async (question: string, botAnswer: string, companyId: string, botOrFaq: number) => {
    const interaction = await prisma.interaction.create({
        data:{
            question,
            botAnswer,
            companyId,
            botOrFaq
        }
    })
    return interaction
}

export const getAllInterections = async (companyId: string) => {
    const interactions = await prisma.interaction.findMany({
        where:{
            companyId
        },
        orderBy:{
            createAt: "desc"
        }
    })
    return interactions
}