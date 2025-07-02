
# 🧠 Chatbot Backend – Plataforma de Atendimento com IA

Este é o backend da plataforma **AtendeBot**, um sistema de chatbot personalizado para empresas, com integração à API da OpenAI para atendimento automatizado e inteligente.

---

## 🚀 Tecnologias utilizadas

- **Node.js** com **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL**
- **JWT** (autenticação)
- **Nodemailer** (envio de e-mails)
- **OpenAI API** (respostas inteligentes)
- **dotenv** para variáveis de ambiente

---

## 📁 Estrutura de diretórios

```
src/
├── controllers/      # Controladores das rotas
├── routes/           # Definições das rotas
├── services/         # Lógicas de negócio (email, IA, etc.)
├── middlewares/      # Middlewares como auth
├── libs/             # Integrações externas (OpenAI, nodemailer)
├── prisma/           # Cliente do Prisma
└── server.ts         # Arquivo principal da aplicação
```

---

## ⚙️ Como executar o projeto

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/chatbot-backend.git
cd chatbot-backend
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o arquivo `.env`
Crie um arquivo `.env` com as variáveis:

```env
DATABASE_URL=postgresql://usuario:senha@localhost:5432/chatbot
JWT_SECRET=sua_chave_secreta
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=seu@email.com
EMAIL_PASS=sua_senha
OPENAI_API_KEY=sua-chave-openai
```

### 4. Configure o Prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Inicie o servidor
```bash
npm run dev
```

Servidor rodando em: `http://localhost:3333`

---

## 📌 Principais rotas

| Método | Rota                  | Descrição                            |
|--------|-----------------------|--------------------------------------|
| POST   | `/empresa/cadastrar`  | Cadastra uma nova empresa            |
| POST   | `/empresa/login`      | Login com JWT                        |
| GET    | `/faq`                | Lista perguntas/respostas da empresa|
| POST   | `/chat`               | Envia pergunta para IA               |
| GET    | `/interacoes`         | Histórico de interações              |
| GET    | `/estatisticas`       | Métricas da conta                    |

---

## 🤖 Como funciona a IA

A IA da OpenAI responde às perguntas dos clientes com base nas informações cadastradas pela empresa (horário, formas de pagamento, FAQs, etc.), simulando um atendimento humanizado.

---

## 📄 Licença

Projeto acadêmico de TCC – Engenharia de Software – UNIGRAN Capital.  
Criado por **Josdegar Ferreira dos Santos**.
