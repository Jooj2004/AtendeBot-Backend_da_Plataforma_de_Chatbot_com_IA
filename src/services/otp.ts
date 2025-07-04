import { prisma } from "../libs/prisma"

export const createOTP = async (companyId: string) => {
    let otpArray: number[] = []
    for(let i = 0; i < 6; i++){
        otpArray.push(Math.floor(Math.random() * 9 ))
    }

    let code = otpArray.join('')

    let expiredAt = new Date()
    expiredAt.setMinutes(expiredAt.getMinutes() + 30)

    const otp = await prisma.oTP.create({
        data:{
            code,
            companyId,
            expiredAt
        }
    })

    return otp
}

export const validateOTP = async (id: string, code: string) => {
    const otp = await prisma.oTP.findFirst({
        select:{
            company: true 
        },
        where:{
            id, 
            code,
            expiredAt: {
                gt: new Date()
            },
            used: false
        }
    })

    if(otp && otp.company){
        await prisma.oTP.delete({
            where:{id}
        })

        await prisma.company.update({
            where:{
                id: otp.company.id
            },
            data:{
                verification: true
            }
        })

        return otp.company
    }

    return false
}