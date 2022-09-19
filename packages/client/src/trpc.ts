import { createReactQueryHooks } from "@trpc/react";
import { appRouter } from "api-server";

// bring all that together by using create react0query hooks on our appRouter
export const trpc = createReactQueryHooks<appRouter>()

