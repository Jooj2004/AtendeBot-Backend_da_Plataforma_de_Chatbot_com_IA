import { RequestHandler } from "express";
import signinSchema from '../schema/signin'
import { getCompanyByEmail } from "../services/company";

export const signin:RequestHandler = (req, res) => {
    const data = signinSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.formErrors.fieldErrors}) 
        return
    }

    const company = getCompanyByEmail(data.data.email)
    if(company != null){
        res.json({error: "Já existe uma empresa cadastrada com essas informações"}) 
        return 
    }
    
}