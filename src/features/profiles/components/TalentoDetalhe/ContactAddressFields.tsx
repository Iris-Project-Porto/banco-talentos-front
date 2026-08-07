import { Input } from "@/components/ui";
import { formatCep, formatEmail, formatTelephone } from "@/utils/masks";
import type { ProfileFormState } from "../../types/profile";

export type ContactAddressForm = Pick<
    ProfileFormState,
    "contact" | "contactEmail" | "phone" | "address" | "postalCode" | "cityState"
>;

export type ContactAddressUpdater = <K extends keyof ContactAddressForm>(
    field: K,
    value: ContactAddressForm[K],
) => void;

export type ProfileFormUpdater = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K],
) => void;

interface Props {
    form: ContactAddressForm;
    updateField: ContactAddressUpdater;
}

export function ContactAddressFields({ form, updateField }: Props) {
    return (
        <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                    label="Contato"
                    value={form.contact}
                    onChange={(e) => updateField("contact", e.target.value)}
                />
                <Input
                    label="E-mail"
                    type="email"
                    value={form.contactEmail}
                    onChange={(e) => updateField("contactEmail", formatEmail(e.target.value))}
                    placeholder="nome@empresa.com"
                />
                <Input
                    label="Telefone"
                    value={form.phone}
                    onChange={(e) => updateField("phone", formatTelephone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    inputMode="tel"
                    maxLength={15}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                    <Input
                        label="Endereço"
                        value={form.address}
                        onChange={(e) => updateField("address", e.target.value)}
                    />
                </div>
                <Input
                    label="CEP"
                    value={form.postalCode}
                    onChange={(e) => updateField("postalCode", formatCep(e.target.value))}
                    placeholder="00000-000"
                    inputMode="numeric"
                    maxLength={9}
                />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Input
                    label="Cidade / UF"
                    value={form.cityState}
                    onChange={(e) => updateField("cityState", e.target.value)}
                    placeholder="São Paulo / SP"
                />
            </div>
        </div>
    );
}
