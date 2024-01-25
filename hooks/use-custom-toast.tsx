import Link from "next/link";
import { toast } from "@/hooks/use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      action: (
        <Link
          href="/sign-in"
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          Login
        </Link>
      ),
      description: "You need to be logged in to do that.",
      title: "Login required",
      variant: "destructive",
    });
  };

  return { loginToast };
};
