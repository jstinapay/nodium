import { polar, checkout, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";
import { polarClient } from "./polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: true,
    },
    
    plugins: [
        polar({
            client: polarClient,
            createCustomerOnSignUp: true,
            use: [
                checkout({
                    products: [
                        {
                            productId: "3d20d0b5-6c5f-420a-aad1-1db9b5394a01",
                            slug: "Nodium-Pro" // Custom slug for easy reference in Checkout URL, e.g. /checkout/Nodium-Pro
                        }
                    ],
                    successUrl: "/workflows",
                    authenticatedUsersOnly: true
                }),
                portal()
            ],
        })
    ]
});