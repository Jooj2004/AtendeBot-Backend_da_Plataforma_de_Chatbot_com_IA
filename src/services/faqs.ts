import { prisma } from '../libs/prisma'
import { FaqType } from '../types/faq-type'

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
            answer: true
        },
        where:{
            companyId
        }
    })
    return list
}

export const getFaqById = async (companyId: string, id: number) => {
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

export const updateFaq = async (companyId: string, id: number, data:FaqType) => {
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

export const deleteFaq = async (id:number, companyId: string) => {
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