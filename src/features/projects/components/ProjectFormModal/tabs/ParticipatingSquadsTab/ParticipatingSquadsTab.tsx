import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui";
import type { ProjectEditFormInput } from "../../../../validations/validations";


interface Props {
    isEdit: boolean;
}

export function ParticipatingSquadsTab({ isEdit }: Props) {
    const {
        register,
        formState: { errors },
    } = useFormContext<ProjectEditFormInput>();

    return (
        <div className="flex-1 px-7 py-6 flex flex-col gap-5">
            {/* <Input
                label="NOME DO PROJETO"
                placeholder="Ex: Migração de Cloud, Portal do Cliente..."
                error={errors.name?.message}
                required
                {...register("name")}
            /> */}

            <div>
                <p>squads participantes</p>
                <button>adicionar squad</button>
                <br />
                <button>selecionarsquad</button>
            </div>

            <div>
                <p>tabela squads</p>
            </div>

            <div>
                aviso importante
            </div>

        </div>
    );
}
