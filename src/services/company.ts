import { prisma } from "../libs/prisma"

export const getCompanyByEmail = async (email:string) => {
    const company = await prisma.company.findUnique({
        where:{ email }
    })
    return company 
}

export const getCompanyById = async (id:string) => {
    const company = await prisma.company.findUnique({
        where:{ id }
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