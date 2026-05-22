import { PageHeader } from "@/components/ui/PageHeader";

const FORM_BUILDER_URL = import.meta.env.VITE_FORM_BUILDER_URL ?? "http://localhost:3000";

export default function Forms() {
  return (
    <div className="flex flex-col gap-4 h-full">
      <PageHeader
        title="Forms"
        subtitle="Criação e gestão de formulários"
      />

      <div className="flex-1 bg-white border border-slate-200 rounded-xl shadow-card overflow-hidden" style={{ minHeight: "calc(100vh - 180px)" }}>
        <iframe
          src={FORM_BUILDER_URL}
          title="Form Builder"
          className="w-full h-full border-0"
          style={{ minHeight: "calc(100vh - 180px)" }}
          allow="clipboard-write"
        />
      </div>
    </div>
  );
}
