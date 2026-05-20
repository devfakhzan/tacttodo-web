import { Layout } from "../components/Layout";
import { AuthForm } from "../components/AuthForm";

type AuthPageProps = {
  onSuccess: () => void;
};

export function AuthPage({ onSuccess }: AuthPageProps) {
  return (
    <Layout
      title="TactTodo"
      subtitle="Sign in or create an account to manage your list."
    >
      <AuthForm onSuccess={onSuccess} />
    </Layout>
  );
}
