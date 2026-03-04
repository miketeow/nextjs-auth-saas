"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const SetPasswordButton = ({ email }: { email: string }) => {
  return (
    <Button
      variant="outline"
      onClick={() =>
        authClient.requestPasswordReset({
          email,
          redirectTo: "/auth/login",
          fetchOptions: {
            onSuccess: () => {
              toast.success("Password reset email sent");
            },
          },
        })
      }
    >
      Sent Password Reset Email
    </Button>
  );
};

export default SetPasswordButton;
