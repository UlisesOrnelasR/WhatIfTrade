import { betterAuth } from "better-auth";
import { mongodbAdapter} from "better-auth/adapters/mongodb";
import { connectToDatabase} from "@/database/mongoose";
import { env } from "@/lib/env";
import { nextCookies} from "better-auth/next-js";
import type { Db } from "mongodb";

function createAuth(db: Db) {
    return betterAuth({
        database: mongodbAdapter(db),
        secret: env.betterAuthSecret,
        baseURL: env.betterAuthUrl,
        emailAndPassword: {
            enabled: true,
            disableSignUp: false,
            requireEmailVerification: false,
            minPasswordLength: 8,
            maxPasswordLength: 128,
            autoSignIn: true,
        },
        plugins: [nextCookies()],
    });
}

type AuthInstance = ReturnType<typeof createAuth>;

let authInstance: AuthInstance | null = null;

export const getAuth = async (): Promise<AuthInstance> => {
    if(authInstance) return authInstance;

    const mongoose = await connectToDatabase();
    const db = mongoose.connection.db;

    if(!db) throw new Error('MongoDB connection not found');

    authInstance = createAuth(db as unknown as Db);

    return authInstance;
}

export const auth = await getAuth();
