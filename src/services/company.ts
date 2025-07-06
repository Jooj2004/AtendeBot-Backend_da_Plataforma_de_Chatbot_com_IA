import { Prisma } from "@prisma/client"
import { prisma } from "../libs/prisma"

export const getCompanyByEmail = async (email:string) => {
    const company = await prisma.company.findUnique({
        where:{ email },
        include: {
            faqs:true,
             inter: true
        }
    })
    return company 
}

export const getCompanyById = async (id:string) => {
    const company = await prisma.company.findUnique({
        where:{ id },
        include: {
            faqs:true,
            inter: true
        }
    })
    return company 
}

export const createCompany = async (name:string, email:string, CNPJ:string, password:string, description?:string ) => {
    const company = await prisma.company.create({
        data:{
            name, description, email, CNPJ, password
        }
    })
    return company
}

export const updateCompany = async (companyId:string, data:Prisma.CompanyUpdateInput) => {
    const company = await prisma.company.update({
        where:{
            id: companyId
        },
        data
    })
    return company
}

export const updatePassword = async(id:string, hash:string) => {
    const company = await prisma.company.update({
        where:{
            id
        },
        data:{
            password: hash
        }
    })
    return company
}

export const updateEmail = async (companyId:string, newEmail:string) => {
    const company = await prisma.company.update({
        where:{
            id: companyId
        },
        data:{
            verification: false,
            email: newEmail
        }
    })
    return company
}

export const deleteCompany = async (companyId: string) => {
    try{
        const otp = await prisma.oTP.deleteMany({
            where:{
                companyId
            }
        })
        const faq = await prisma.fAQ.deleteMany({
            where:{
                companyId
            }
        })
        const inter = await prisma.interaction.deleteMany({
            where:{
                companyId
            }
        })
        const company = await prisma.company.delete({
            where:{
                id: companyId
            }
        })
        return true 
    }catch{
        return false
    }
}