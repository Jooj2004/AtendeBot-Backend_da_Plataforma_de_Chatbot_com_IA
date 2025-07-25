import { prisma } from "../libs/prisma"

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

export const getAllInterections = async (companyId: string) => {
    const interactions = await prisma.interaction.findMany({
        select:{
            question: true,
            botAnswer: true,
            createAt: true,
            id: true
        },
        where:{
            companyId
        },
        orderBy:{
            createAt: "desc"
        }
    })
    return interactions
}