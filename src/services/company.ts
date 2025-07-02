import { prisma } from "../libs/prisma"

export const getCompanyByEmail = async (email:string) => {
    const company = await prisma.company.findUnique({
        where:{ email }
    })
    return company 
}