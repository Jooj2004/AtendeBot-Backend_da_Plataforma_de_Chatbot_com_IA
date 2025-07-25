import bcrypt from "bcryptjs"
import { prisma } from "../libs/prisma"
import { createCompany, deleteCompany, getCompanyByEmail, updateCompany, updateEmail, updatePassword } from "./company"

const company = {
    name: "Empresa Teste",
    email: "teste@empresa.com",
    CNPJ: "47.678.637/0001-03",
    password: "SenhaSegura123#",
    description: "Empresa fictícia para teste"
}
const newEmail = "novoEmail@gmail.com"

describe("Testing services of company.ts", async () => {
    const getCompany = await getCompanyByEmail(company.email)

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
        expect(getCompany?.email).toBe(company.email)
        expect(getCompany?.CNPJ).toBe(company.CNPJ) 
    })

    it("Should service updateCompany success", async () => {
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

    it("Should service updateEmail success", async () => {
        const newEmailCompany = await updateEmail(getCompany?.id as string, newEmail)

        expect(newEmailCompany).toBeDefined()
        expect(newEmailCompany.id).toBe(getCompany?.id)
        expect(getCompany?.email).not.toBe(newEmailCompany.email)
        expect(newEmailCompany.email).toBe(newEmail)
        expect(newEmailCompany.verification).toBe(false)
    })

    it("Should service updatePassword success", async () => {
        const newPass = "novaSenha"

        const getCompany = await getCompanyByEmail(newEmail)
        console.log(getCompany?.id)

        const hash = await bcrypt.hash(newPass,10)

        const newPassCompany = await updatePassword(getCompany?.id as string, hash)

        expect(newPassCompany).toBeDefined()
        expect(newPassCompany.id).toBe(getCompany?.id)
        expect(newPassCompany.password).not.toBe(newPass)
        expect(newPassCompany.password).toBe(hash)
    })

    it("Should service updatePassword success", async () => {
        const getCompany = await getCompanyByEmail(newEmail)

        const finish = await deleteCompany(getCompany?.id as string)

        expect(finish).toBe(true)

        const getCompany2 = await getCompanyByEmail(newEmail)

        expect(getCompany2).not.toBeDefined
    })
})