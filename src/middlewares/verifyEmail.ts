import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";

export const verifyEmail = async (req:ExtendedRequest, res: Response, next: NextFunction) => {
    if(!req.verify){
        res.status(401).json({error: "Faça a verificação do seu email para continuar"})
        return
    }
    next()
}