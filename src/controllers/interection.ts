import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getAllInterections } from "../services/interaction";

export const getInterections = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const interactions = await getAllInterections(companyId)

    res.json({interactions})
}