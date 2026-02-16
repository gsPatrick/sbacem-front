"use client";

import { useEffect, useState } from "react";
import { AlertCircle } from "lucide-react";

const HUB_VERIFY_URL = "http://localhost:8000/auth/verify-session-browser";
const SYSTEM_ID = "1";

export function SessionExpiredModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => setOpen(true);
        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);

    const handleVerify = () => {
        const currentUrl = window.location.href;
        window.location.href = `${HUB_VERIFY_URL}?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(currentUrl)}`;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-6 border-t-4 border-blue-600">
                <div className="flex flex-col items-center text-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 text-blue-600">
                        <AlertCircle className="h-6 w-6" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-800 mb-2">Sessão Expirada</h2>
                    <p className="text-slate-500 mb-6 text-sm">
                        Sua credencial de segurança precisa ser renovada no Hub Central.
                    </p>

                    <button
                        onClick={handleVerify}
                        className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md transition-colors uppercase text-xs tracking-wider"
                    >
                        Renovar Acesso
                    </button>
                </div>
            </div>
        </div>
    );
}
