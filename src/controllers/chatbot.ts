import { RequestHandler } from "express";
import { validateQuestion } from "../schema/chatbot/question";
import { getCompanyById } from "../services/company";
import { getAllFaqs } from "../services/faqs";
import { createChatContext } from "../services/chatbot";

export const createInteraction:RequestHandler = async (req, res) => {
// 1. Get the company ID from the request
// The company ID will be used to find the correct company and its FAQs

    const {id} = req.params 
        if(!id){
            res.json({error: "É necessário encaminhar o id da empresa válido"})
            return
    }

// 2. Check if the company exists in the database
// If not, return an error message

    const company = await getCompanyById(id)
    if(!company){
        res.json({error: "Essa empresa não existe no sistema"})
        return
    }

// 3. Validate the question (make sure it's not empty or too short)

    const data = validateQuestion.safeParse(req.body)
    if(!data.success){
        res.json({error: data.error.flatten().fieldErrors})
        return
    }

// 4. Get all FAQs (questions and answers) from this company
// These will be used to check if the answer already exists

    const allFaqsFromTheCompany = await getAllFaqs(company.id)

// 5. Try to find an answer in the FAQs before using the AI
// We check if the client's question contains any known FAQ question

    const checkQuestionOnFaqs = allFaqsFromTheCompany.find( faq => {
        faq.question.toLowerCase().trim() === data.data.question.toLowerCase().trim() 
    } )

// 6. If a FAQ answer is found, return it immediately
// No need to use the AI in this case

    if(checkQuestionOnFaqs){
        //Desenvolva a resposta sem usar a IA. Farei depois
    }

// 7. If no FAQ answer is found, we prepare the context for the AI
// This includes company info + all FAQs + the client's question
// ALL IN STRING. exemple: const contexto = ` company.data, company.faq, prompt `

    const context = createChatContext() //Desenvolver depois. Ele retornará uma string

// 8. Send the context and question to OpenAI (GPT) to get an answer



// 9. Get the AI's answer from the response



// 10. Save the interaction to the database (for history and statistics)




// 11. Send the final answer back to the client

   
}