import { components } from "@les-chauffagistes/authentication-types"


export async function getMe(): Promise<components["schemas"]["User"]> {
    return await (fetch(
        `${process.env.NEXT_PUBLIC_AUTH_URL}/me`,
        {
            credentials: "include"
        }
    ).then((res) => res.json()));
}