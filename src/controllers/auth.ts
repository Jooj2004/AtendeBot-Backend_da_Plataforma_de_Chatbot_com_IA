import { RequestHandler } from "express";
import {signinSchema} from '../schema/signin'
import {signupSchema} from "../schema/signup";
import { useOTPSchema } from "../schema/useOTP";
import { createCompany, getCompanyByEmail, getCompanyById, updatePassword } from "../services/company";
import { createOTP, validateOTP } from "../services/otp";
import { sendEmail } from "../libs/nodemailer";
import { createJWT } from "../libs/jwt";
import bcrypt from "bcryptjs";
import { editPasswordSchema } from "../schema/editPassword";

export const signup:RequestHandler = async (req, res) => {
    const data = signupSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors}) 
        return
    }

    const company = await getCompanyByEmail(data.data.email)
    if(company){
        res.json({error: "Já existe uma empresa cadstrada com esse e-mail"}) 
        return 
    }

    const hash = await bcrypt.hash(data.data.password, 10)

    const {email,name,description,CNPJ} = data.data 
    const newCompany = await createCompany(name, email, CNPJ, hash, description)

    res.status(201).json({sucess: true})
}

export const signin:RequestHandler = async (req, res) => {
    const data = signinSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors}) 
        return
    }

    const company = await getCompanyByEmail(data.data.email)
    if(!company){
        res.json({error: "Empresa não existe"}) 
        return 
    }
    
    const verifyPass = await bcrypt.compare(data.data.password, company.password)
    if(!verifyPass){
        res.json({error: "A senha digitada não está correta"})
        return
    }

    const token = createJWT(company.id, company.verification)

    res.json({token, company})
}

export const verifyEmail:RequestHandler = async (req, res) => {
    const {companyId} = req.body 

    const company = await getCompanyById(companyId)
    if(!company){
        res.json({error: "Empresa não existe"}) 
        return 
    }
    if(company.verification){
        res.json({verify: true})
        return
    }

    const otp = await createOTP(company.id)  

    await sendEmail(
        company.email,
        'Seu códigode acesso é: ' + otp.code,
        otp.code
    )

    res.json({idOTP : otp.id})
}

export const useOTP:RequestHandler = async (req, res) => {
    const data = useOTPSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors}) 
        return
    }

    let company = await validateOTP(data.data.id, data.data.code)
    if(!company){
        res.json({error: "OTP inválido ou expirado!"})
        return
    }

    company.verification = true

    const token = createJWT(company.id, company.verification)

    res.json({token, company})

}

export const editPassword:RequestHandler = async (req, res) => {
    const data = editPasswordSchema.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const company = await getCompanyById(data.data.id) 
    if(!company){
        res.json({error: "Empresa não existe"}) 
        return 
    }

    const verifyPass = await bcrypt.compare(data.data.actualPass, company.password)
    if(!verifyPass){
        res.json({error: "A senha digitada não está correta"})
        return
    }

    const verifyNewPass = await bcrypt.compare(data.data.newPass, company.password)
    if(verifyNewPass){
        res.json({error: "A nova senha é a mesma atual"})
        return
    }

    const hash = await bcrypt.hash(data.data.newPass, 10)

    const update = await updatePassword(data.data.id, hash)
    if(!update){
        res.json({error: "A senha não foi atualizada, tente novamente mais tarde"})
        return
    }

    res.json({sucess: true, company: update})
}