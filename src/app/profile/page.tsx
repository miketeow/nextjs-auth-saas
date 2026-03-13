import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { auth } from "@/lib/auth";
import {
  ArrowLeft,
  Key,
  LinkIcon,
  Loader2Icon,
  Shield,
  User,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import ProfileUpdateTab from "./_components/profile-update-form";
import { ReactNode, Suspense } from "react";
import SetPasswordButton from "./_components/set-password-button";
import ChangePasswordTab from "./_components/change-password-form";
import SessionsManagement from "./_components/sessions-management";
import AccountLinking from "./_components/account-linking";
import AccountDeletion from "./_components/account-deletion";
import TwoFactorAuthTab from "./_components/two-factor-auth";

const ProfilePage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session == null) return redirect("/auth/login");
  return (
    <div className="max-w-4xl mx-auto my-6 px-4">
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center mb-6">
          <ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>

        <div className="flex items-center space-x-4">
          <div className="size-16 bg-muted rounded-full flex items-center justify-center overflow-hidden">
            {session.user.image ? (
              <Image
                width={64}
                height={64}
                src={session.user.image}
                alt="User Avatar"
                className="object-cover"
              />
            ) : (
              <User className="size-8 text-muted-foreground" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex gap-1 justify-between items-start">
              <h1 className="text-3xl font-bold">
                {session.user.name || "User Profile"}
              </h1>
              <Badge>{session.user.role}</Badge>
            </div>
            <p className="text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </div>

      <Tabs className="space-y-2" defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">
            <User />
            <span className="max-sm:hidden">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield />
            <span className="max-sm:hidden">Security</span>
          </TabsTrigger>
          <TabsTrigger value="sessions">
            <Key />
            <span className="max-sm:hidden">Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="accounts">
            <LinkIcon />
            <span className="max-sm:hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="danger">
            <User />
            <span className="max-sm:hidden">Danger</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardContent>
              <ProfileUpdateTab user={session.user} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <LoadingSuspence>
            <SecurityTab
              email={session.user.email}
              isTwoFactorEnabled={session.user.twoFactorEnabled ?? false}
            />
          </LoadingSuspence>
        </TabsContent>

        <TabsContent value="sessions">
          <LoadingSuspence>
            <SessionsTab currentSessionToken={session.session.token} />
          </LoadingSuspence>
        </TabsContent>

        <TabsContent value="accounts">
          <LoadingSuspence>
            <LinkedAccountsTab />
          </LoadingSuspence>
        </TabsContent>

        <TabsContent value="danger">
          <Card className="border border-destructive">
            <CardHeader>
              <CardTitle className="text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent>
              <AccountDeletion />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;

async function LinkedAccountsTab() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  const nonCredentialAccounts = accounts.filter(
    (a) => a.providerId !== "credential",
  );

  return (
    <Card>
      <CardContent>
        <AccountLinking currentAccounts={nonCredentialAccounts} />
      </CardContent>
    </Card>
  );
}

async function SecurityTab({
  email,
  isTwoFactorEnabled,
}: {
  email: string;
  isTwoFactorEnabled: boolean;
}) {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  const hasPasswordAccount = accounts.some(
    (a) => a.providerId === "credential",
  );

  return (
    <div className="space-y-6">
      {hasPasswordAccount ? (
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password for improved security
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordTab />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>
              We will sent you a password reset email to set up a password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SetPasswordButton email={email} />
          </CardContent>
        </Card>
      )}
      {hasPasswordAccount && (
        <Card>
          <CardHeader className="flex justify-between items-center gap-2">
            <CardTitle>Two Factor Authentication</CardTitle>
            <Badge variant={isTwoFactorEnabled ? "default" : "secondary"}>
              {isTwoFactorEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </CardHeader>
          <CardContent>
            <TwoFactorAuthTab />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function SessionsTab({
  currentSessionToken,
}: {
  currentSessionToken: string;
}) {
  const sessions = await auth.api.listSessions({ headers: await headers() });

  return (
    <Card>
      <CardContent>
        <SessionsManagement
          sessions={sessions}
          currentSessionToken={currentSessionToken}
        />
      </CardContent>
    </Card>
  );
}

function LoadingSuspence({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<Loader2Icon className="size-20 animate-spin" />}>
      {children}
    </Suspense>
  );
}
