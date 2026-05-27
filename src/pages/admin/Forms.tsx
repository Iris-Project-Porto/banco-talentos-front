import { PageHeader } from "@/components/ui/PageHeader";

const FORM_BUILDER_URL = import.meta.env.VITE_FORM_BUILDER_URL ?? "https://banco-talentos-form.netlify.app";

export default function Forms() {
  return (
    <div className="flex flex-col h-screen bg-slate-50">
      <div className="p-4">
        <PageHeader
          title="Forms"
          subtitle="Criação e gestão de formulários"
        />
      </div>

      <div className="flex-1 w-full bg-white border-t border-slate-200 shadow-card overflow-hidden">
        <iframe
          src={FORM_BUILDER_URL}
          title="Form Builder"
          className="w-full h-full border-0"
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}