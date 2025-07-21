import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { getAllInterections } from "../services/interaction";
import { getCompanyById } from "../services/company";

export const getInterections = async (req: ExtendedRequest, res: Response) => {
    const companyId = req.companyId as string

    const interactions = await getAllInterections(companyId)

    res.json({interactions})
}