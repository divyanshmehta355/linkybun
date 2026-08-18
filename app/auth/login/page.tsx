import { LoginForm } from "@/components/login-form";
import { MainLayout } from "@/components/layout/main-layout";

export default function Page() {
  return (
    <MainLayout>
      <div className="flex flex-1 w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}
