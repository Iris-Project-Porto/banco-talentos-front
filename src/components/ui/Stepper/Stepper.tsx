import { Check } from "lucide-react";

export interface StepperStep {
    label: string;
    description?: string;
}

interface Props {
    steps: StepperStep[];
    currentStep: number;
    onStepClick?: (stepIndex: number) => void;
}

export function Stepper({ steps, currentStep, onStepClick }: Props) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl shadow-card px-6 py-5">
            <ol className="flex items-start">
                {steps.map((step, index) => {
                    const isCompleted = index < currentStep;
                    const isActive = index === currentStep;
                    const isLast = index === steps.length - 1;
                    const isClickable = Boolean(onStepClick && isCompleted);

                    return (
                        <li key={step.label} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
                            {isClickable ? (
                                <button
                                    type="button"
                                    onClick={() => onStepClick?.(index)}
                                    className="flex items-center gap-3 text-left group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-pink rounded-lg p-1 -m-1 transition-all"
                                    title={`Voltar para ${step.label}`}
                                    aria-label={`Voltar para etapa ${index + 1}: ${step.label}`}
                                >
                                    <span
                                        className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0 bg-green-500 text-white transition-all group-hover:scale-105 group-hover:bg-green-600 shadow-sm"
                                    >
                                        <Check className="w-4 h-4" />
                                    </span>
                                    <div className="hidden sm:block">
                                        <p className="text-sm font-semibold text-slate-900 group-hover:text-pink transition-colors">
                                            {step.label}
                                        </p>
                                        {step.description && (
                                            <p className="text-xs text-slate-400">{step.description}</p>
                                        )}
                                    </div>
                                </button>
                            ) : (
                                <div className="flex items-center gap-3 select-none">
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
                            )}
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
