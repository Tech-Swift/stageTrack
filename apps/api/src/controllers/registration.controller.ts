import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { registrationRules } from "../config/registrationRules";


export const createRegistrationRequest = async (
    req: Request,
    res: Response
): Promise<void> =>{
    try {
        const {
            tenantCode,
            firstName,
            lastName,
            phone,
            email,
            nationalId,
            role,
            profileImageUrl,
            goodConductUrl,
            licenceUrl,
            badgeUrl,
            vehicleLogbookUrl,
        } = req.body;

        //find tenant by code
        const tenant = await prisma.tenant.findUnique({
            where: { code: tenantCode},
        });

        if (!tenant) {
            res.status(404).json({
                success: false,
                message: "Invalid tenant code",
            });
            return;
        }

        const rules = registrationRules[role as keyof typeof registrationRules];

            if (!rules) {
            res.status(400).json({
                success: false,
                message: "Invalid role selected",
            });
            return;
            }

            // 3. Validate required documents dynamically
            const missingFields = rules.required.filter((field) => {
            return !req.body[field];
            });

            if (missingFields.length > 0) {
            res.status(400).json({
                success: false,
                message: "Missing required documents for selected role",
                missingFields,
            });
            return;
            }

            // 4. prevent duplicate applications
            const existing = await prisma.registrationRequest.findFirst({
            where: {
                tenantId: tenant.id,
                nationalId,
                role,
            },
            });

            if (existing) {
            res.status(409).json({
                success: false,
                message: "You already submitted a request for this role in this SACCO",
            });
            return;
            }
        

        //create registration request
        const request = await prisma.registrationRequest.create({
            data: {
               tenantId: tenant.id,
               firstName,
               lastName,
               phone,
               email,
               nationalId,
               role,
               profileImageUrl,
               goodConductUrl,
               licenceUrl,
               badgeUrl,
               vehicleLogbookUrl,
            },
        });
        res.status(201).json({
            success: true,
            message: "Registration request submitted",
            data: request,
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "failed to submit registration request",
        });
    }
};