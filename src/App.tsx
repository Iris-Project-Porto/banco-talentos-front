import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "@/features/auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router } from "@/routes";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@/components/ui";
import { Toaster } from "react-hot-toast";

const queryClient = new QueryClient();

function GlobalErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-card max-w-md w-full border border-slate-200">
        <div className="text-pink font-bold text-4xl mb-4">Ops!</div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Algo deu errado na interface</h2>
        <p className="text-sm text-slate-500 mb-6">
          Um erro inesperado ocorreu. Pode ter sido uma falha de conexão ou um dado corrompido.
        </p>
        <pre className="bg-red-50 text-red-600 text-xs p-4 rounded-lg text-left overflow-auto mb-6 max-h-32">
          {error.message}
        </pre>
        <Button onClick={resetErrorBoundary} variant="primary" fullWidth>
          Recarregar Aplicação
        </Button>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary FallbackComponent={GlobalErrorFallback} onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Toaster position="top-center" />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}