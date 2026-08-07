import { Check } from "lucide-react";

export interface StepperStep {
    label: string;
    description?: string;
}

interface Props {
    steps: StepperStep[];
    currentStep: number;
}

export function Stepper({ steps, currentStep }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isLast = index === steps.length - 1;

                    return (
                        <li key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 ${
                                        isCompleted
                                            ? "bg-green-500 text-white"
                                            : isActive
                                                ? "bg-pink text-white"
                                                : "bg-slate-100 text-slate-400"
                                    }`}
                                >
                                    {isCompleted ? <Check className="w-4 h-4" /> : index + 1}
                                </span>
                                <div className="hidden sm:block">
                                    <p className={`text-sm font-semibold ${isActive || isCompleted ? "text-slate-900" : "text-slate-400"}`}>
                                        {step.label}
                                    </p>
                                    {step.description && (
                                        <p className="text-xs text-slate-400">{step.description}</p>
                                    )}
                                </div>
                            </div>
                            {!isLast && (
                                <div className={`flex-1 h-0.5 mx-4 ${isCompleted ? "bg-green-500" : "bg-slate-200"}`} />
                            )}
                        </li>
                    );
                })}
            </ol>
        </div>
    );
}
