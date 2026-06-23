import { useFormContext } from "react-hook-form";
import { type VagaFormData } from "../../validations/validations";
import { Field, INPUT_CLS } from "../FormHelpers/FormHelpers";

export function AdditionalInfoFields({ canEdit }: { canEdit: boolean }) {
    const { register } = useFormContext<VagaFormData>();

    return (
        <fieldset disabled={!canEdit} className="flex flex-col gap-4 mt-2">
            <Field label="Descrição da Vaga">
                <textarea className={`${INPUT_CLS} min-h-[80px] resize-y`} placeholder="Conteúdo principal..." {...register("description")} />
            </Field>
            <Field label="Anotações Internas (Exclusivo RH)">
                <textarea className={`${INPUT_CLS} min-h-[60px] resize-y`} placeholder="Notas de alinhamento..." {...register("notes")} />
            </Field>
        </fieldset>
    );
}