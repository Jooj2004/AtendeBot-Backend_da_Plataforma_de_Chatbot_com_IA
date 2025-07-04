import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { createFAQSchema } from "../schema/faqs/create";
import { updateFAQSchema } from "../schema/faqs/update";
import { createFaq, getAllFaqs, updateFaq, deleteFaq, getFaqById } from "../services/faqs";

export const create = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const data = createFAQSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const faq = await createFaq(data.data.question, data.data.answer, companyId)

    res.json({success: true, faq: faq})
}

export const list = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const list = await getAllFaqs(companyId)

    res.json({list}) 
}

export const faq = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string
    const {id} = req.params

    const faq = await getFaqById(companyId, Number(id))
    if(!faq){
        res.json({error: "Faq não encontrado"})
        return
    }

    res.json({faq})
}

export const edit = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const data = updateFAQSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const question = data.data.question
    const answer = data.data.answer
    
    const faq = await updateFaq(companyId, data.data.id, {question, answer})
    if(!faq){
        res.json({error: "Faq ou Empresa não existe"})
        return
    }

    res.json({faq}) 

}

export const deleteFaqCon = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string
    const {id} = req.params

    const del = await deleteFaq(Number(id), companyId)
    if(!del){
        res.json({error: "Não foi possível deletar"})
        return
    }

    res.json({del})
}