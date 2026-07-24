"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { components } from "@les-chauffagistes/authentication-types";
import { getMe, logOut } from "./api";
import LinkWithSearchParams from "./components/LinkWithSearchParams";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const [user, setUser] = useState<components["schemas"]["User"] | undefined | null>(undefined);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const appName = searchParams.get("appname");

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.main}>
        {redirect && (
            <button
                className={"tertiary"}
                onClick={() => {
                  window.location.href = redirect;
                }}
            >
                {appName ? `Retourner sur ${appName}` : "Retourner là où j'étais"}
            </button>
        )}
        {user === undefined && <p>Loading...</p>}
        {user === null && <>
            <p>Pas connecté</p>
            <button className={"primary"}>
                <LinkWithSearchParams
                    href="/login"
                >Se connecter</LinkWithSearchParams>
            </button>
        </>
        }
        {user && <>
            <p>Connecté en tant que {user.pseudo}</p>
            <button className={"primary"}>
              <LinkWithSearchParams
                  href={{ pathname: "/login", query: { flow: "link" } }}
              >Lier un compte</LinkWithSearchParams>
            </button>
            <button className={"tertiary"} onClick={async () => logOut().then(() => {
              setUser(null);
            })}>Se déconnecter
            </button>
        </>
        }
      </div>
    </div>
  );
}
