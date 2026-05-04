import { Link, useLocation } from "react-router-dom";

const items = [
    { label: "Usuarios", to: "/dashboard/users" },
    { label: "Cuentas bancarias", to: "/dashboard/accounts" },
];

export const Sidebar = () => {
    const location = useLocation();

    return (
        <aside className="w-64 bg-slate-900 text-white h-full p-5 border-r border-white/10">
            <p className="text-[10px] font-bold tracking-widest uppercase text-white/30 mb-3 px-2">
                Panel
            </p>
            <ul className="flex flex-col gap-1">
                {items.map((item) => {
                    const active = location.pathname === item.to;
                    return (
                        <li key={item.to}>
                            <Link
                                to={item.to}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all
                                ${active
                                    ? "bg-white/10 text-white border-l-4 border-indigo-500"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                {item.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </aside>
    );
};