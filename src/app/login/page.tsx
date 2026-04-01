import { LoginForm } from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const q = await searchParams;
  const authError =
    q.error === "auth"
      ? "We could not complete sign-in from your link. Try email and password."
      : undefined;
  return (
    <div className="flex min-h-full flex-1 items-center justify-center px-6 py-16">
      <LoginForm errorHint={authError} />
    </div>
  );
}
