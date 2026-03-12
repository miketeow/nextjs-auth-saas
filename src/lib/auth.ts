import { db } from "@/drizzle/db";
import { env } from "@/env";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { twoFactor } from "better-auth/plugins";

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
      sendChangeEmailConfirmation: async ({ user, url, newEmail }) => {
        console.log("--------------------------------");
        console.log(`[DEV MOCK] Send New Email Confirmation`);
        console.log(`To: ${user.email}`);
        console.log(`Link: ${url}`);
        console.log(`New Email: ${newEmail}`);
        console.log("--------------------------------");
      },
    },
    deleteUser: {
      enabled: true,
      sendDeleteAccountVerification: async ({ user, url }) => {
        console.log("--------------------------------");
        console.log(`[DEV MOCK] Send Delete Account Verification`);
        console.log(`To: ${user.email}`);
        console.log(`Link: ${url}`);
        console.log("--------------------------------");
      },
    },
  },
  account: {
    accountLinking: {
      enabled: true,
      allowDifferentEmails: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    // 1. Mock Password Reset Email
    sendResetPassword: async ({ user, url }) => {
      console.log("--------------------------------");
      console.log(`[DEV MOCK] Send Password Reset`);
      console.log(`To: ${user.email}`);
      console.log(`Link: ${url}`);
      console.log("--------------------------------");
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendOnSignUp: true,
    sendOnSignIn: true,
    // 2. Mock Verification Email
    sendVerificationEmail: async ({ user, url }) => {
      console.log("--------------------------------");
      console.log(`[DEV MOCK] Send Verification Email`);
      console.log(`To: ${user.email}`);
      console.log(`Link: ${url}`);
      console.log("--------------------------------");
    },
  },
  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60, // 1 minutes
    },
  },
  appName: "nextjs-auth-saas",
  plugins: [nextCookies(), twoFactor()],
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
});
