import { useMemo } from "react";
import { useFormContext, useFieldArray, useWatch } from "react-hook-form";
import { Trash2, FileText, CheckCircle2, HelpCircle } from "lucide-react";
import { type VagaFormData } from "@/features/vagas/validations/validations";
import { ErrorMsg, Field, INPUT_CLS } from "../FormHelpers/FormHelpers";

export function SkillsSection({ canEdit }: { canEdit: boolean }) {
    const { register, control, formState: { errors } } = useFormContext<VagaFormData>();
    const { fields, append, remove } = useFieldArray({ control, name: "skills" });

    const watchedSkills = useWatch({ control, name: "skills" }) || [];

    const totalSkillsWeight = useMemo(() => {
        return watchedSkills.reduce((acc, curr) => acc + (Number(curr?.importanceWeight) || 0), 0);
    }, [watchedSkills]);

    return (
        <fieldset disabled={!canEdit} className="border border-slate-200 rounded-xl p-6 bg-white flex flex-col gap-5 shadow-sm mt-2">
            <div className="flex items-center gap-3 mb-1">
                <FileText className="w-5 h-5 text-blue-500" />
                <div className="flex items-center gap-2">
                    <div>
                        <h3 className="text-base font-bold text-slate-900">Requisitos da Vaga</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Adicione as skills necessárias para a posição e defina o peso de cada uma.</p>
                    </div>

                    <div className="relative group ml-1 flex items-center justify-center">
                        <HelpCircle className="w-4 h-4 text-slate-400 hover:text-blue-500 cursor-help transition-colors" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-60 bg-slate-800 text-white text-xs rounded-xl p-4 shadow-xl z-50">
                            <p className="font-bold mb-2 text-sm text-white">Sobre os requisitos:</p>
                            <ul className="space-y-1.5 list-disc list-inside marker:text-blue-400 text-slate-300">
                                <li>A soma dos pesos deve ser igual a <span className="font-bold text-white">100%</span>.</li>
                                <li>Skills <span className="font-bold text-white">obrigatórias</span> são essenciais.</li>
                                <li>Skills <span className="font-bold text-white">desejáveis</span> aumentam o match.</li>
                                <li>Defina o nível mínimo esperado.</li>
                            </ul>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-x-4 px-1 pb-3 border-b border-slate-100 text-xs font-bold text-slate-700">
                <div className="col-span-2">Skill</div><div className="col-span-2">Tipo</div>
                <div className="col-span-2 text-center">Peso (%)</div><div className="col-span-2">Nível Mínimo</div>
            </div>

            {fields.length === 0 && (
                <div className="text-center py-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl">
                    <p className="text-sm text-slate-500">Nenhuma skill adicionada para esta vaga.</p>
                </div>
            )}

            <datalist id="skill-suggestions">
                <option value="Java" /><option value="SQL" /><option value="React" /><option value="TypeScript" />
                <option value="Node.js" /><option value="AWS" /><option value="Docker" /><option value="Inglês" />
            </datalist>

            <div className="flex flex-col gap-4">
                {fields.map((field, index) => {
                    const skillType = watchedSkills[index]?.type || field.type;
                    const skillErr = errors.skills?.[index];

                    return (
                        <div key={field.id} className="grid grid-cols-12 gap-x-4 items-start pb-4 border-b border-slate-100 last:border-0 last:pb-0">

                            <div className="col-span-2">
                                <input list="skill-suggestions" className="w-full text-sm outline-none bg-transparent text-slate-700 font-medium placeholder:font-normal placeholder:text-slate-400" placeholder="Ex: Java" {...register(`skills.${index}.name` as const)} />
                                <ErrorMsg msg={skillErr?.name?.message} />
                            </div>

                            <div className="col-span-2">
                                <select
                                    className={`w-full rounded-md border px-3 py-1.5 text-sm outline-none focus:border-pink cursor-pointer transition-colors ${skillType === 'MANDATORY'
                                        ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium'
                                        : 'bg-green-50 border-green-200 text-green-700 font-medium'
                                        }`}
                                    {...register(`skills.${index}.type` as const)}
                                >
                                    <option value="MANDATORY">Obrigatória</option>
                                    <option value="DESIRABLE">Desejável</option>
                                </select>
                            </div>

                            <div className="col-span-2 flex flex-col items-center">
                                <div className="flex items-center justify-center gap-2">
                                    <input
                                        type="number"
                                        min="0"
                                        max="100"
                                        className={`w-16 rounded-md border ${skillErr?.importanceWeight ? 'border-red-400' : 'border-slate-200'} px-2 py-1.5 text-center text-sm outline-none focus:border-pink`}
                                        placeholder="0"

                                        {...register(`skills.${index}.importanceWeight` as const, { valueAsNumber: true })}
                                    />
                                    <span className="text-sm font-medium text-slate-600">%</span>
                                </div>
                                <ErrorMsg msg={skillErr?.importanceWeight?.message} />
                            </div>

                            <div className="col-span-2">
                                <select className="w-full rounded-md border border-slate-200 px-3 py-1.5 text-sm outline-none focus:border-pink bg-white" {...register(`skills.${index}.minLevel` as const)}>
                                    <option value="BASIC">Básico</option>
                                    <option value="INTERMEDIATE">Intermediário</option>
                                    <option value="ADVANCED">Avançado</option>
                                </select>
                            </div>


                            <div className="col-span-1 flex items-center justify-center gap-2 pt-1">
                                <button type="button" onClick={() => remove(index)} className="text-xs text-red-400 hover:text-red-600 transition-colors" title="Excluir"><Trash2 className="w-4 h-4" /></button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
                <button type="button" onClick={() => append({ name: "", type: "MANDATORY", minLevel: "BASIC", importanceWeight: 0, description: "" })} className="flex items-center gap-1.5 text-blue-600 text-sm font-semibold border border-blue-600 rounded-md px-4 py-2 hover:bg-blue-50 transition-colors">
                    + Adicionar Skill
                </button>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-bold text-slate-700">Soma dos Pesos: <span className={totalSkillsWeight === 100 ? 'text-green-600' : 'text-red-500'}>{totalSkillsWeight}%</span></span>
                        {totalSkillsWeight === 100 ? (
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-md uppercase tracking-wider border border-green-100"><CheckCircle2 className="w-3.5 h-3.5" strokeWidth={3} />Peso validado</div>
                        ) : (
                            <div className="bg-red-50 text-red-600 text-xs font-semibold px-3 py-1.5 rounded-md">Inválido</div>
                        )}
                    </div>
                    <ErrorMsg msg={errors.skills?.root?.message || errors.skills?.message} />
                </div>

            </div>
        </fieldset>
    );
}