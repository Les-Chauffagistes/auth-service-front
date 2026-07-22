"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { components } from "@les-chauffagistes/authentication-types";
import { getMe, logOut } from "./api";
import LinkWithSearchParams from "./components/LinkWithSearchParams";

export default function Home() {
  const [user, setUser] = useState<components["schemas"]["User"] | undefined | null>(undefined);

  useEffect(() => {
    getMe().then(setUser);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.main}>
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
            <button className={"tertiary"} onClick={async () => logOut().then(_ => {
              setUser(null);
            })}>Se déconnecter
            </button>
        </>
        }
      </div>
    </div>
  );
}
