import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PageHeader, Button, Badge, Card, Pagination } from "@/components/ui";
import { squadsApi } from "@/features/squads/api/squads.api";
import { Pencil } from "lucide-react";

export default function Squads() {
    const [search, setSearch] = useState("");
    const [statusType, setStatusType] = useState<"ACTIVE" | "INACTIVE">("ACTIVE");
    const [page, setPage] = useState(0);

    const { data, isLoading } = useQuery({
        queryKey: ['squads', statusType, page, search],
        queryFn: () => statusType === "ACTIVE"
            ? squadsApi.getActive({ page, size: 10, search })
            : squadsApi.getInactive({ page, size: 10, search })
    });

    const squads = data?.content || [];
    const totalPages = data?.totalPages || 1;

    return (
        <div className="flex flex-col gap-6">
            <PageHeader
                title="Squads"
                subtitle="Gerencie as squads da sua empresa"
                actions={<Link to="/admin/squads/nova"><Button variant="primary">+ Nova Squad</Button></Link>}
            />

            <Card padding="sm" className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4 items-end">
                    <div className="lg:col-span-2">
                        <input
                            placeholder="Buscar por nome da squad..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-pink focus:shadow-focus-pink"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 mb-1 block">Status</label>
                        <select
                            value={statusType}
                            onChange={(e) => setStatusType(e.target.value as "ACTIVE" | "INACTIVE")}
                            className="w-full text-sm border border-slate-300 rounded-md px-3 py-2 outline-none focus:border-pink"
                        >
                            <option value="ACTIVE">Ativa</option>
                            <option value="INACTIVE">Inativa</option>
                        </select>
                    </div>
                    <div>
                        <Button variant="secondary" fullWidth className="h-[38px] text-xs" onClick={() => { setSearch(""); setPage(0); }}>
                            Limpar filtros
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto mt-4">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase">
                                <th className="py-3 px-4">Squad</th>
                                <th className="py-3 px-4">Liderança</th>
                                <th className="py-3 px-4">Projeto</th>
                                <th className="py-3 px-4 text-center">Status</th>
                                <th className="py-3 px-4 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-slate-700">
                            {isLoading ? <tr><td colSpan={6} className="py-8 text-center text-slate-400">Carregando...</td></tr> :
                                squads.length === 0 ? <tr><td colSpan={6} className="py-8 text-center text-slate-400">Nenhuma squad encontrada.</td></tr> :
                                    squads.map((squad) => (
                                        <tr key={squad.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 px-4 font-bold text-slate-900 flex items-center gap-3">
                                                {squad.name}
                                            </td>
                                            <td className="py-4 px-4">
                                                <div className="flex flex-col gap-0.5">
                                                    <span className="font-medium text-slate-800 text-xs" title="Project Manager">PM: {squad.projectManager}</span>
                                                    <span className="text-slate-500 text-xs" title="Coordenador Porto">Coord: {squad.portoCoordinator}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-600 font-medium">{squad.projectName || "N/A"}</td>
                                            <td className="py-4 px-4 text-center">
                                                <Badge variant={squad.active ? 'success' : 'danger'}>
                                                    {squad.active ? 'Ativa' : 'Inativa'}
                                                </Badge>
                                            </td>
                                            <td className="py-4 px-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link to={`/admin/squads/${squad.id}`} className="p-1.5 text-slate-400 hover:text-pink bg-slate-50 hover:bg-pink/10 rounded-md transition-colors" title="Visualizar/Editar">
                                                        <Pencil className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                        </tbody>
                    </table>
                </div>
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            </Card>
        </div>
    );
}