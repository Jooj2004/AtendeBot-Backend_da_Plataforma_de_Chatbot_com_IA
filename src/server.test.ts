import request from 'supertest'
import app from "./app"
import { prisma } from './libs/prisma'
import bcrypt from 'bcryptjs'

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

    const getCompany = async () => await prisma.company.findUnique({where:{email: company.email}})

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

    describe("", () => {
        
    })
    
})