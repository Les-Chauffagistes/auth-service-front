import { components } from "@les-chauffagistes/authentication-types"

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
    const res = await authFetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/me`);
    if (!res.ok) return null;
    return res.json();
}

export async function refreshToken() {
    return await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/refresh`, { credentials: "include", method: "POST" });
}

export async function getLNChallenge(): Promise<components["schemas"]["LNChallenge"]> {
    return await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/lightning/challenge`).then(res => res.json());
}

export async function exchangeCode(code: string): Promise<components["schemas"]["ExchangeCodePayload"]> {
    return await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/exchange`, { credentials: "include", method: "POST", body: JSON.stringify({ "code": code }) }).then(res => res.json());
}

export async function logOut() {
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_URL}/logout`, {
        method: "DELETE",
        credentials: "include",
        mode: "cors"
    })
}