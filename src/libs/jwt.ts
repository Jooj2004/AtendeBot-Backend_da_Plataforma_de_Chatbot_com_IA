import { NextFunction,Response } from 'express'
import { ExtendedRequest } from '../types/extended-request'
import jwt from 'jsonwebtoken'

export const createJWT = (id: string, verify: boolean) => {
    return jwt.sign({id, verify}, process.env.JWT_TOKEN as string, {expiresIn: '8h'})
}

export const verifyJWT = (req:ExtendedRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers['authorization']
    if(!authHeader){
        res.status(401).json({error: "Acesso negado"})
        return
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.JWT_TOKEN as string,
        (err, decoded: any) => {
            if(err){
                res.status(500).json({error: "Acesso negado"})
                return
            }

            req.companyId = decoded.id
            req.verify = decoded.verify
            next()
        }
    )
}