import { Response } from "express"
import { ExtendedRequest } from "../types/extended-request"
import { updateCompanySchema } from "../schema/company/edit"
import { emailSchema } from '../schema/company/email'
import { deleteCompany, updateCompany, updateEmail } from "../services/company"
import { createJWT } from "../libs/jwt"

export const edit = async (req:ExtendedRequest, res:Response) => {
    const companyId = req.companyId as string

    const data = updateCompanySchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const company = await updateCompany(companyId, data.data)
    if(!company){
        res.json({error: "Dados não atualizados. Tente novamente mais tarde"})
        return
    }

    res.json({company})
}

export const updateEmailCon = async (req:ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const data = emailSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const company = await updateEmail(companyId, data.data.email)
    if(!company){
        res.json({error: "Não foi possível atualizar o e-mail"})
    }

    const token = createJWT(company.id, company.verification)

    res.json({token, company})
}

export const deleteAll = async (req:ExtendedRequest, res:Response) => {
    const companyId = req.companyId as string

    const del = await deleteCompany(companyId)
    if(!del){
        res.json({error: "Não foi possível apagar a empresa"})
        return
    }

    res.json({success: true, message: "Empresa totalmente deletada do sistema"})
}