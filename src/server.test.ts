import request from 'supertest'
import app from "./app"
import { prisma } from './libs/prisma'
import bcrypt from 'bcryptjs'
import { createOTP } from './services/otp'
import { Company} from '@prisma/client'
import { createJWT } from './libs/jwt'

const company = {
    name: "Empresa Teste",
    email: "teste@empresa.com",
    CNPJ: "47.678.637/0001-03",
    password: "SenhaSegura123#",
    description: "Empresa fictícia para teste"
}

describe("Testing api routes", () => {
    beforeAll(async () => {
        await prisma.company.deleteMany()
    })
    
    afterAll(async () => {
        await prisma.interaction.deleteMany()
        await prisma.fAQ.deleteMany()
        await prisma.oTP.deleteMany()
        await prisma.company.deleteMany()
        await prisma.$disconnect()
    })

    it("Should ping pong", (done) => {
        request(app)
            .get('/ping')
            .then(res => {
                expect(res.body.pong).toBeTruthy()
                return done()
            })
    })

    describe("Testing create company route", () => {
        it("Should create a new company with valid data", (done) => {
            const {name,email,password,description,CNPJ} = company
            const emailURL = encodeURIComponent(email)
            request(app)
                .post('/auth/signup')
                .send(`name=${name}&password=${password}&email=${emailURL}&CNPJ=${CNPJ}&description=${description}`)
                .then(response => {
                    expect(response.status).toBe(201);
                    expect(response.body).toHaveProperty("sucess", true);
                    expect(response.body.newCompany).toHaveProperty("id");
                    expect(response.body.newCompany.email).toBe(email)
                    return done()
                })
        })
        it("Should fail if email is already registered", (done) => {
            const {name,email,password,description,CNPJ} = company
            const emailURL = encodeURIComponent(email)
            request(app)
                .post('/auth/signup')
                .send(`name=${name}&password=${password}&email=${emailURL}&CNPJ=${CNPJ}&description=${description}`)
                .then(response => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error).toBe("Já existe uma empresa cadstrada com esse e-mail")
                    return done() 
                })
        })
        it("Should fail if required fields are missing or invalid", (done) => {
            request(app)
                .post('/auth/signup')
                .send(`name=&password=&email=notAnEmail&CNPJ=&description=`)
                .then(response => {
                    expect(response.body).toHaveProperty("error");
                    expect(response.body.error).toHaveProperty("name");
                    expect(response.body.error).toHaveProperty("email");
                    expect(response.body.error).toHaveProperty("CNPJ");
                    expect(response.body.error).toHaveProperty("password");
                    return done()
                })
        })
        it("Should store hashed password", async () => {
            const getCompany = await prisma.company.findUnique({where:{email: company.email}})
            expect(getCompany).toBeDefined();
            expect(getCompany?.password).not.toBe(company.password);

            const isMatch = await bcrypt.compare(company.password, getCompany?.password as string);
            expect(isMatch).toBe(true);
        })
        it("Should set verification to false by default", async () => {
            const getCompany = await prisma.company.findUnique({where:{email: company.email}})
            expect(getCompany).toBeDefined();
            expect(getCompany?.verification).toBeFalsy()
        })
    })

    describe("Testing login route", () => {
        it("Should login successfully with correct credentials", (done) => {
            const { email, password } = company
            const emailURL = encodeURIComponent(email)
            request(app)
                .post("/auth/signin")
                .send(`email=${emailURL}&password=${password}`)
                .then(response => {
                    expect(response.status).toBe(200)
                    expect(response.body).toHaveProperty("token")
                    expect(response.body).toHaveProperty("company")
                    return done()
                })
        })
        it("Should fail with incorrect and invalid format password", (done) => {
            const { email, password } = company
            const emailURL = encodeURIComponent(email)
            request(app)
                .post("/auth/signin")
                .send(`email=${emailURL}&password=SenhaIncorreta123`)
                .then(response => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error).toHaveProperty("password")
                    done()
                })
            request(app)
                .post("/auth/signin")
                .send(`email=${emailURL}&password=SenhaIncorreta@123`)
                .then(response => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error).toBe("A senha digitada não está correta")
                    return done()
                })
        })
        it("Should fail with non-existent email", (done) => {
            request(app)
                .post("/auth/signin")
                .send(`email=EmailErrado@gmail.com&password=${company.password}`)
                .then(response => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error).toBe("Empresa não existe")
                    done()
                })
        })
    })

    describe("Testing OTPs route", () => {
        let otpId: string
        let otpCode: string

        beforeEach(async () => {
            const company = await prisma.company.findFirst()
            const otp = await createOTP(company!.id)
            otpId = otp.id
            otpCode = otp.code
        });

        it("Should otp with valid code", (done) => {
            request(app)
                .post("/auth/useotp")
                .send(`id=${otpId}&code=${otpCode}`)
                .then(async (response) => {
                    expect(response.body).toHaveProperty("token")
                    const company = await prisma.company.findFirst()
                    expect(company?.verification).toBeTruthy()
                    return done()
                })
        })
        it("Should otp with invalid code", (done) => {
            request(app)
                .post("/auth/useotp")
                .send(`id=${otpId}&code=555555`)
                .then(async (response) => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error).toBe("OTP inválido ou expirado!")
                    return done()
                })
        })
    })

    describe("Testing FAQs routes", () => {
       let companyEscop: Company
       let tokenEscop: string

       beforeAll(async ()=>{
            const company = await prisma.company.findFirst()
            companyEscop = company as Company
            const token = await createJWT(company?.id as string, company?.verification as boolean)
            tokenEscop = token 
       })

       it("Should create faqs success", (done) => {
            request(app)
                .post("/faq/create")
                .set("Authorization", `Bearer ${tokenEscop}`)
                .send({
                    question: "Vocês funcionam aos finais de semana?",
                    answer: "Sim, abrimos aos sábados das 8h às 14h."
                }).then(response => {
                    expect(response.body.success).toBe(true)
                    expect(response.body.faq).toHaveProperty("id")
                    expect(response.body.faq.question).toBe("Vocês funcionam aos finais de semana?")
                    return done() 
                })
       })
       it("Should fail with invalid data (empty question)", (done) => {
            request(app)
                .post("/faq/create")
                .set("Authorization", `Bearer ${tokenEscop}`)
                .send({
                    question: "",
                    answer: "Resposta qualquer"
                }).then(response => {
                    expect(response.body).toHaveProperty("error")
                    expect(response.body.error.question).toBeDefined()
                    return done()
                })   
        })

        it("Should fail if company does not exist", (done) => {
            const fakeToken = createJWT("id_fake_123", true)
            request(app)
                .post("/faq/create")
                .set("Authorization", `Bearer ${fakeToken}`)
                .send({
                    question: "Pergunta qualquer",
                    answer: "Resposta qualquer"
                }).then(response => {
                    expect(response.body).toHaveProperty("error", "Empresa não encontrada")
                    return done()
                })
        })
    })

    describe("Final Test. THE BOT", () => {
        ///chat/new/:id
        it("Should ")
    })


    /* IA
        ✔️ Sucesso com pergunta válida e contexto completo
        ✔️ Sucesso com pergunta que já existe nos FAQs
        ❌ Falha com ID de empresa inexistente
        ❌ Falha com pergunta inválida (campo vazio, string curta, etc)
    */
    
})