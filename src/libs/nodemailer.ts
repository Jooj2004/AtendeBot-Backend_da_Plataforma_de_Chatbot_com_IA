import nodemailer from 'nodemailer'

export const sendEmail = async (to: string, subject: string, body: string) => {
    const email = process.env.EMAIL as string
    const pass = process.env.EMAIL_PASS as string


    let transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: email,
            pass
        }
    })

    let message = {
        from: email,
        to,
        subject,
        html:
        `
            <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
        <meta charset="UTF-8">
        <title>Confirmação de E-mail – AtendeBot</title>
        <style>
            body {
            font-family: 'Segoe UI', sans-serif;
            background: linear-gradient(to right, #eef2f3, #ffffff);
            margin: 0;
            padding: 0;
            }

            .container {
            max-width: 620px;
            margin: 30px auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
            overflow: hidden;
            }

            .header {
            background-color: #0056b3;
            color: #fff;
            text-align: center;
            padding: 30px 20px;
            position: relative;
            font-size: 24px;
            font-weight: bold;
            }

            .header img {
            max-height: 60px;
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            }

            .content {
            padding: 30px;
            text-align: center;
            color: #333;
            }

            .content p {
            font-size: 17px;
            margin: 15px 0;
            }

            .code-box {
            display: inline-block;
            background: #f0f8ff;
            border: 2px dashed #0056b3;
            padding: 18px 32px;
            font-size: 26px;
            font-weight: bold;
            color: #0056b3;
            margin: 20px 0;
            border-radius: 8px;
            }

            .button {
            display: inline-block;
            background-color: #007bff;
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            font-size: 16px;
            transition: background-color 0.3s;
            }

            .button:hover {
            background-color: #0056b3;
            }

            .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #666;
            }

            .footer a {
            color: #007bff;
            text-decoration: none;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <img src="https://i.imgur.com/5V2C4Fy.png" alt="AtendeBot Logo">
            AtendeBot – Confirmação de E-mail
            </div>
            <div class="content">
            <p>Olá!</p>
            <p>Seu código de verificação para ativar sua conta na plataforma <strong>AtendeBot</strong> é:</p>
            <div class="code-box">${body}</div>
            <p>Insira esse código na tela de confirmação para validar sua conta.</p>
            <a href="#" class="button">Confirmar meu acesso</a>
            <p style="margin-top: 30px; font-size: 14px;">Se você não solicitou este e-mail, apenas ignore.</p>
            </div>
            <div class="footer">
            <p>Este é um e-mail automático enviado pela plataforma AtendeBot.</p>
            <p>© 2025 AtendeBot – Todos os direitos reservados.</p>
            </div>
        </div>
        </body>
        </html>

        `,
        text: body
    }

    try {
        console.log('Enviando e-mail para: ', to)
        await transport.sendMail(message)
        return true
    } catch (err) {
        console.log('Erro ao enviar e-mail: ', err.response?.data || err.message)
        return false
    }
}