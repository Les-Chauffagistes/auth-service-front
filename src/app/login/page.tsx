"use client";
import { Suspense, useState } from "react";

import "./login.css";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import LightningQrCode from "../components/LightningQrCode";
import { getLNChallenge } from "../api";
import { components } from "@les-chauffagistes/authentication-types";
import ChoosePseudoPopup from "../components/ChoosePseudoPopup";
import { config } from "@/lib/config";

function DiscordIcon() {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.095 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z" />
        </svg>
    );
}

function LightningIcon() {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
        </svg>
    );
}

function LoginPageContent() {
    const [activeProvider, setActiveProvider] = useState<"lightning" | "credentials" | null>(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [pseudo, setPseudo] = useState("");
    const [pseudoPopupOpen, setPseudoPopupOpen] = useState(false);
    const [pseudoError, setPseudoError] = useState<string | null>(null);
    const [pseudoLoading, setPseudoLoading] = useState(false);
    const [challenge, setChallenge] = useState<components["schemas"]["LNChallenge"] | null>(null);
    const [loading, setLoading] = useState(false);
    const [sessionToken, setSessionToken] = useState<string | null>(null);

    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || config.BASE_URL;
    const showLnForm = activeProvider === "lightning";
    const showCredsForm = activeProvider === "credentials";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const res = await fetch(`${config.AUTH_API_URL}/login-or-register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error ?? "Erreur inconnue");
                return;
            } else {
                console.log(searchParams)
                window.location.href = searchParams.get("redirect") || config.BASE_URL!;
            }
        } catch {
            setError("Erreur réseau");
        } finally {
            setLoading(false);
        }
    }

    async function handlePseudoSubmit(nextPseudo: string) {
        setPseudoError(null);
        setPseudoLoading(true);

        try {
            const res = await fetch(`${config.AUTH_API_URL}/lightning/complete`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ pseudo: nextPseudo, session_token: sessionToken }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                setPseudoError(data?.error ?? "Impossible d'enregistrer ce pseudo.");
                return;
            }

            setPseudo(nextPseudo);
            setPseudoPopupOpen(false);
            window.location.href = searchParams.get("redirect") || config.BASE_URL;
        } catch {
            setPseudoError("Erreur réseau");
        } finally {
            setPseudoLoading(false);
        }
    }

    return (
        <div className="login-container">
            <ChoosePseudoPopup
                key={`${pseudoPopupOpen}-${pseudo}`}
                error={pseudoError}
                initialValue={pseudo}
                isOpen={pseudoPopupOpen}
                isSubmitting={pseudoLoading}
                onClose={() => {
                    if (!pseudoLoading) {
                        setPseudoPopupOpen(false);
                    }
                }}
                onSubmit={handlePseudoSubmit}
            />
            <div className="login-header">
                <Image src="/brand-icon.png" alt="Logo" width={50} height={50} quality={75} />
                <h1>Bon retour parmi nous</h1>
                <p>Connectez-vous à votre compte <span>Chauffagistes</span></p>
            </div>

            <div className="login-methods">
                <div
                    className="login-method"
                    onClick={() => {
                        window.location.href = `${config.AUTH_API_URL}/discord/login?redirect=${redirect}`;
                    }}
                >
                    <div className="login-method-icon">
                        <DiscordIcon />
                    </div>
                    <h3>Discord</h3>
                    <p>Connectez-vous avec votre compte Discord</p>
                </div>

                <span className="login-divider">ou</span>

                <div
                    className={`login-method${showLnForm ? " expanded" : ""}`}
                    onClick={() => {
                        if (!showLnForm) {
                            getLNChallenge().then(challenge => setChallenge(challenge));
                            setError(null);
                            setActiveProvider("lightning");
                        }
                    }}
                >
                    <div className="login-method-icon">
                        <LightningIcon />
                    </div>
                    <h3>Lightning</h3>
                    {!showLnForm && <p>Authentification non-KYC via votre wallet</p>}
                    {showLnForm && (
                        <>
                            <LightningQrCode challenge={challenge} onLogin={(payload) => {
                                if (payload.status === "onboarding") {
                                    setSessionToken(payload.session_token || null); // session_token is never undefined here
                                    setPseudoError(null);
                                    setPseudoPopupOpen(true);
                                } else if (payload.status === "logged_in") {
                                    window.location.href = searchParams.get("redirect") || config.BASE_URL;
                                }
                            }
                            } />
                            <button type="button" className="tertiary" onClick={(e) => { e.stopPropagation(); setActiveProvider(null); }}>
                                Retour
                            </button>
                        </>
                    )}
                </div>

                <span className="login-divider">ou</span>

                <div
                    className={`login-method${showCredsForm ? " expanded" : ""}`}
                    onClick={() => {
                        if (!showCredsForm) {
                            setError(null);
                            setActiveProvider("credentials");
                        }
                    }}
                >
                    <div className="login-method-icon">
                        <UserIcon />
                    </div>
                    <h3>Identifiant</h3>
                    {!showCredsForm && <p>Utiliser un identifiant et un mot de passe</p>}
                    {showCredsForm && (
                        <form className="credentials-form" onSubmit={handleSubmit} onClick={e => e.stopPropagation()}>
                            <input
                                type="text"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                minLength={3}
                                maxLength={30}
                                autoFocus
                                required
                            />
                            <input
                                type="password"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                minLength={8}
                                required
                            />
                            {error && <p className="credentials-error">{error}</p>}
                            <button type="submit" className="primary" disabled={loading}>
                                {loading ? "Connexion..." : "Continuer"}
                            </button>
                            <button type="button" className="tertiary" onClick={(e) => { e.stopPropagation(); setActiveProvider(null); setError(null); }}>
                                Retour
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginPageContent />
        </Suspense>
    );
}
