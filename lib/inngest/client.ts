import { Inngest} from "inngest";
import { env } from "@/lib/env";

export const inngest = new Inngest({
    id: 'signalist',
    ai: { gemini: { apiKey: env.geminiApiKey }}
})
