import { RequestHandler } from "express";
import { validateQuestion } from "../schema/chatbot/question";
import { getCompanyById } from "../services/company";
import { getAllFaqs } from "../services/faqs";
import { createChatContext, createInteractionServ } from "../services/chatbot";

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

    const allFaqsFromTheCompany = await getAllFaqs(company.id)

    const checkQuestionOnFaqs = allFaqsFromTheCompany.find( faq => (
        faq.question.toLowerCase().trim() === data.data.question.toLowerCase().trim() 
    ))

    if(checkQuestionOnFaqs){
        const answer = checkQuestionOnFaqs.answer

        const interaction = createInteractionServ(data.data.question, answer, company.id)
        if(!interaction){
            res.json({error: "Erro interno no servidor. Tente novamente mais tarde"})
            return
        }

        res.json({answer: answer})
        return
    }
    
    const context = createChatContext()

// 8. Send the context and question to OpenAI (GPT) to get an answer



// 9. Get the AI's answer from the response



// 10. Save the interaction to the database (for history and statistics)




// 11. Send the final answer back to the client

   res.json({data: data.data.question})
}