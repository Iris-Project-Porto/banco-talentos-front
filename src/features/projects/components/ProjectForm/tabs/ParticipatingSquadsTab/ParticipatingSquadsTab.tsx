interface Props {
    isEdit: boolean;
}

export function ParticipatingSquadsTab({ isEdit: _isEdit }: Props) {
    return (
        <div className="flex flex-col gap-5 px-7 py-6">
            <div>
                <p>squads participantes</p>
                <button type="button">adicionar squad</button>
                <br />
                <button type="button">selecionar squad</button>
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
