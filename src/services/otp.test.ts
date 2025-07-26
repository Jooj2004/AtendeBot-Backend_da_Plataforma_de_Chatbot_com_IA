import { prisma } from "../libs/prisma"
import bcrypt from "bcryptjs"
import { createCompany } from "./company"
import { createOTP, validateOTP } from "./otp"

describe("Testing service of otp.ts", () => {
    beforeAll(async () => {
        await prisma.company.deleteMany()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it("Should create company and validate the otp code", async () => {
        const hash = await bcrypt.hash("novaSenha",10)

        const newCompany = await createCompany(
            "Empresa teste", 
            "teste@gmail.com", 
            "47.678.637/0001-03CNPJ", 
            hash, 
            "Uma descrição qualquer"
        )

        const newOtp = await createOTP(newCompany.id)

        const {id, code} = newOtp

        const validate = await validateOTP(id, code)

        expect(newCompany).toBeDefined()
        expect(newOtp).toBeDefined()
        expect(validate).not.toBe(false)
        
        const validate2 = await validateOTP(id, code)

        expect(validate2).toBe(false)
    })
})