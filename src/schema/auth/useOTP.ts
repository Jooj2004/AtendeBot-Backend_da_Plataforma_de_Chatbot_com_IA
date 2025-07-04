import z from 'zod'

export const useOTPSchema = z.object({
    id: z.string({message:"ID da OTP é obrigatório"}),
    code: z.string({message:"OTP é obrigatória"}).length(6, "O código têm 6 números")
})