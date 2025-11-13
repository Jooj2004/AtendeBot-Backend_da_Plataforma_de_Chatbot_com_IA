import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getCompanyById } from "../services/company";

export const test = async (req: ExtendedRequest, res: Response) => {
    if(!req.companyId){
        res.status(401).json({error: "Acesso negado"})
        return
    }

    const company = await getCompanyById(req.companyId)
    if(!company){
        res.status(401).json({error: "Acesso negado"})
        return
    }

    res.json({company})
}