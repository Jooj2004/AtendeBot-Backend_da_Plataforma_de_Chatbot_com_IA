import { RequestHandler } from "express";
import { validateQuestion } from "../schema/chatbot/question";
import { getCompanyById } from "../services/company";
import { createChatContext} from "../services/chatbot";
import { openai } from "../libs/openai";
import { createInteractionServ } from "../services/interaction";

export const createInteraction:RequestHandler = async (req, res) => {
    const {id} = req.params 
    if(!id){
        res.json({error: "É necessário encaminhar o id da empresa"})
        return
    }

    const company = await getCompanyById(id)
    if(!company){
        res.json({error: "Essa empresa não existe no sistema"})
        return
    }

    const data = validateQuestion.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

    const checkQuestionOnFaqs = company.faqs.find( faq => (
        faq.question.toLowerCase().trim() === data.data.question.toLowerCase().trim() 
    ))

    if(checkQuestionOnFaqs){
        const answer = checkQuestionOnFaqs.answer

        const interaction = await createInteractionServ(data.data.question, answer, company.id, 2)
        if(!interaction){
            res.json({error: "Erro interno no servidor. Tente novamente mais tarde"})
            return
        }

        res.json({answer: answer})
        return
    }

    const context = await createChatContext(company.name, company.email, company.faqs, company.description)
    if(!context){
        res.json({error: "Não foi possível gerar o prompt, tente novamente mais tarde"})
        return
    }

    try{
        const chatbot = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {role: "system", content: context},
                {role: "user", content: data.data.question}
            ],
            max_tokens: 100
        })

        const answer = chatbot.choices[0].message.content as string

        const interaction = await createInteractionServ(data.data.question, answer, company.id, 1)
        if(!interaction){
            res.json({error: "Erro interno no servidor. Tente novamente mais tarde"})
            return
        }

        res.json(answer)
    }catch(err: any){
        console.error("Erro completo da OpenAI:", JSON.stringify(err, null, 2));
        res.json({error: "Erro ao processar a resposta da IA. Tente novamente mais tarde."})
        return
    }
}