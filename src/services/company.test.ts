import bcrypt from "bcryptjs"
import { prisma } from "../libs/prisma"
import { createCompany, getCompanyByEmail, updateCompany } from "./company"

const company = {
    name: "Empresa Teste",
    email: "teste@empresa.com",
    CNPJ: "47.678.637/0001-03",
    password: "SenhaSegura123#",
    description: "Empresa fictícia para teste"
}

describe("Testing services of company.ts", () => {
    beforeAll(async () => {
        await prisma.company.deleteMany()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it("Should create a new company", async () => {
        const{name, email, CNPJ, password, description} = company
        const hash = await bcrypt.hash(password,10)
        const newCompany = await createCompany(name, email, CNPJ, hash, description)

        expect(newCompany).toBeDefined()
        expect(newCompany?.id).toBeDefined()
        expect(newCompany?.name).toBe(name) 
        expect(newCompany?.password).not.toBe(password)
    })

    it("Should service getCompanyByEmail success", async () => {
       const getCompany = await getCompanyByEmail(company.email)

        expect(getCompany?.email).toBe(company.email)
        expect(getCompany?.CNPJ).toBe(company.CNPJ) 
    })

    it("Should service updateCompany success", async () => {
        const getCompany = await getCompanyByEmail(company.email)

        const newData = {
            name: "Novo nome",
            description: "Nova descrição"
        }

        const newCompany = await updateCompany(getCompany?.id as string, newData)

        expect(newCompany).toBeDefined()
        expect(newCompany.id).toBe(getCompany?.id)
        expect(newCompany.name).not.toBe(company.name)
        expect(newCompany.name).toBe(newData.name)
    })
})