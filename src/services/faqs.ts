import { Prisma } from '@prisma/client'
import { prisma } from '../libs/prisma'

export const createFaq = async (question: string, answer: string, companyId: string) => {
    const faq = await prisma.fAQ.create({
        data:{
            question,
            answer,
            companyId
        }
    })
    return faq
}

export const getAllFaqs = async (companyId: string) => {
    const list = await prisma.fAQ.findMany({
        select:{
            id: true,
            question: true,
            answer: true,
            updateAt: true
        },
        where:{
            companyId
        },
        orderBy:{
            updateAt: 'desc'
        }
    })
    return list
}

export const getFaqById = async (companyId: string, id: string) => {
    const faq = await prisma.fAQ.findUnique({
        select: {
            question: true,
            answer: true
        },
        where: {
            id, companyId
        }
    })
    return faq
}

export const updateFaq = async (companyId: string, id: string, data:Prisma.FAQUpdateInput) => {
    try{
        const faq = await prisma.fAQ.update({
            where:{
                id,
                companyId
            },
            data
        })
        return faq
    }catch{
        return false
    }
}

export const deleteFaq = async (id:string, companyId: string) => {
    try{
        return await prisma.fAQ.delete({
            where: {
                id,
                companyId
            }
        })
    }catch{
        return false
    }
}

export const deleteFaqAll = async (companyId: string) => {
    try{
        return await prisma.fAQ.deleteMany({
            where:{
                companyId
            }
        })
    }catch{
        return false
    }
}