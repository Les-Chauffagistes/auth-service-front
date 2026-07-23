import { components } from "@les-chauffagistes/authentication-types"
import { config } from "@/lib/config";

async function authFetch(input: RequestInfo, init?: RequestInit) {
    let res = await fetch(input, {
        ...init,
        credentials: "include"
    });

    if (res.status === 401) {
        const refreshed = await refreshToken();
        if (!refreshed) return res;

        res = await fetch(input, {
            ...init,
            credentials: "include"
        });
    }

    return res;
}

export async function getMe(): Promise<components["schemas"]["User"] | null> {
    const res = await authFetch(`${config.AUTH_API_URL}/me`);
    if (!res.ok) return null;
    return res.json();
}

export async function refreshToken() {
    return await fetch(`${config.AUTH_API_URL}/refresh`, { credentials: "include", method: "POST" });
}

export async function getLNChallenge(flow: "login" | "link" = "login"): Promise<components["schemas"]["LNChallenge"]> {
    const query = flow === "link" ? "?flow=link" : "";
    const res = await fetch(`${config.AUTH_API_URL}/lightning/challenge${query}`, { credentials: "include" });
    if (!res.ok) {
        throw new Error("Unable to create Lightning challenge");
    }
    return res.json();
}

export async function exchangeCode(code: string): Promise<components["schemas"]["ExchangeCodePayload"]> {
    return await fetch(`${config.AUTH_API_URL}/exchange`, { credentials: "include", method: "POST", body: JSON.stringify({ "code": code }) }).then(res => res.json());
}

export async function logOut() {
    await fetch(`${config.AUTH_API_URL}/logout`, {
        method: "DELETE",
        credentials: "include",
        mode: "cors"
    })
}

export type LinkedProviders = {
    discord: boolean;
    lightning: boolean;
    credentials: boolean;
    username: string | null;
};

export async function getProviders(): Promise<LinkedProviders | null> {
    const res = await authFetch(`${config.AUTH_API_URL}/providers`);
    if (!res.ok) return null;
    return res.json();
}