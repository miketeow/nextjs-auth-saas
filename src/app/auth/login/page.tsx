"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpTab from "./_components/sign-up-tab";
import SignInTab from "./_components/sign-in-tab";
import { Separator } from "@/components/ui/separator";
import SocialAuthButtons from "./_components/social-auth-buttons";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import EmailVerification from "./_components/email-verification";
import ForgotPassword from "./_components/forgot-password";

type Tab = "signin" | "signup" | "email-verification" | "forgot-password";
function LoginClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Read state directly from url params

  const selectedTab = (searchParams.get("tab") as Tab) || "signin";
  const currentEmail = searchParams.get("email") || "";

  useEffect(() => {
    authClient.getSession().then((session) => {
      if (session.data != null) router.push("/");
    });
  }, [router]);

  // Universal URL Updater
  const handleTabChange = (newTab: string, userEmail?: string) => {
    // Clone current params to acoid overwrite unrelated query params
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", newTab);

    if (userEmail) {
      params.set("email", userEmail);
    }

    // Use router replace so that user's back button don't get broken by tab's click
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={(t) => handleTabChange(t as Tab)}
      className="mx-auto w-full my-6 px-4"
    >
      {(selectedTab === "signin" || selectedTab === "signup") && (
        <TabsList>
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
      )}

      <TabsContent value="signin">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <SignInTab
              openEmailVerificationTab={(email) =>
                handleTabChange("email-verification", email)
              }
              openForgotPassword={() => handleTabChange("forgot-password")}
            />
          </CardContent>

          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="signup">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Sign Up</CardTitle>
          </CardHeader>
          <CardContent>
            <SignUpTab
              openEmailVerificationTab={(email) =>
                handleTabChange("email-verification", email)
              }
            />
          </CardContent>
          <Separator />

          <CardFooter className="grid grid-cols-2 gap-3">
            <SocialAuthButtons />
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="email-verification">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Verify Your Email</CardTitle>
          </CardHeader>
          <CardContent>
            <EmailVerification email={currentEmail} />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="forgot-password">
        <Card>
          <CardHeader className="text-2xl font-bold">
            <CardTitle>Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <ForgotPassword openSignInTab={() => handleTabChange("signin")} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

// Suspense boundary
export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="flex justify-center mt-10">Loading...</div>}
    >
      <LoginClient />
    </Suspense>
  );
}
