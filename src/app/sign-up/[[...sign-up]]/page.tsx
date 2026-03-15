import { SignUp } from "@clerk/nextjs";

export default function SignUpCatchAllPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/"
        forceRedirectUrl="/"
      />
    </div>
  );
}
