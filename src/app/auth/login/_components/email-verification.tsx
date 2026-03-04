import { Button } from "@/components/ui/button";
import { useCountdown } from "@/hooks/use-countdown";
import { authClient } from "@/lib/auth-client";

const EmailVerification = ({ email }: { email: string }) => {
  const { timeLeft, startTimer } = useCountdown("resend-email-timer");

  const handleResend = async () => {
    startTimer(30);
    await authClient.sendVerificationEmail({
      email,
      callbackURL: "/",
    });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground mt-2">
        We sent you a verification link. Please check your email and click the
        link to verify your account.
      </p>

      <Button
        variant="outline"
        className="w-full"
        onClick={handleResend}
        disabled={timeLeft > 0}
      >
        {timeLeft > 0 ? `Resend Email (${timeLeft}s)` : `Resend Email`}
      </Button>
    </div>
  );
};

export default EmailVerification;
