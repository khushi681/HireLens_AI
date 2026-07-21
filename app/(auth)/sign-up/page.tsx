import { SignUp } from "@clerk/nextjs";
import { APP_NAME } from "@/constants";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Create your account
        </h1>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Join {APP_NAME} and get AI-powered resume feedback
        </p>
      </div>
      <SignUp
        routing="path"
        path="/sign-up"
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        appearance={{
          elements: {
            rootBox: "mx-auto w-full max-w-md",
            card: "shadow-sm border border-zinc-200 dark:border-zinc-800 rounded-xl",
          },
        }}
      />
    </div>
  );
}
