import { RequestHandler } from "express";
import {signinSchema} from '../schema/signin'
import {signupSchema} from "../schema/signup";
import { useOTPSchema } from "../schema/useOTP";
import { createCompany, getCompanyByEmail, getCompanyById } from "../services/company";
import { createOTP, validateOTP } from "../services/otp";
import { sendEmail } from "../libs/nodemailer";
import { createJWT } from "../libs/jwt";
import bcrypt from "bcryptjs";

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

    //res.json({companyId: company.id})


    /*
    const otp = await createOTP(company.id)  

    await sendEmail(
        company.email,
        'Seu códigode acesso é: ' + otp.code,
        otp.code
    )

    res.json({idOTP : otp.id})
    */
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

    const company = await validateOTP(data.data.id, data.data.code)
    if(!company){
        res.json({error: "OTP inválido ou expirado!"})
        return
    }

    company.verification = true

    const token = createJWT(company.id, company.verification)

    res.json({token, company})

 }