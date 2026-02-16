"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const HUB_URL = "http://localhost:8000"; // Adjust if needed
const SATELLITE_API = "http://localhost:8001"; // Satellite 2 is port 8001

function LiberarContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const nextPath = searchParams.get("next") || "/";

    useEffect(() => {
        if (!token) {
            alert("Token inválido.");
            return;
        }

        const runHandshake = async () => {
            try {
                // Call Satellite Backend to validate token & set cookie
                const res = await fetch(`${SATELLITE_API}/api/liberar?token=${token}&next=${nextPath}`);

                if (res.ok) {
                    router.push(nextPath);
                } else {
                    console.error("Falha no handshake");
                    alert("Falha na validação de acesso.");
                }
            } catch (err) {
                console.error("Erro de conexão", err);
            }
        };

        runHandshake();
    }, [token, nextPath, router]);

    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
                Validando Acesso
            </h2>
            <p className="text-sm text-slate-500 mt-2">
                Conectando ao Hub Central...
            </p>
        </div>
    );
}

export default function LiberarScreen() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                <p className="text-sm text-slate-500 mt-2 italic">Preparando conexão...</p>
            </div>
        }>
            <LiberarContent />
        </Suspense>
    );
}
