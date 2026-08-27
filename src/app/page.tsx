"use client";

import { Suspense, useEffect, useState } from "react";
import styles from "./page.module.css";
import { components } from "@les-chauffagistes/authentication-types";
import { getMe, logOut } from "./api";
import LinkWithSearchParams from "./components/LinkWithSearchParams";
import { useSearchParams } from "next/navigation";

function HomeContent() {
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
            <div className={styles.redirectCard}>
              <p className={styles.redirectText}>
                {appName ? <>Vous êtiez sur <strong>{appName}</strong>.</> : "Vous aviez une navigation en cours."}
              </p>
              <button
                  className={"secondary"}
                  onClick={() => {
                    window.location.href = redirect;
                  }}
              >
                  {appName ? `Revenir sur ${appName}` : "Revenir à la page précédente"}
              </button>
            </div>
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

export default function Home() {
  return (
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>
  );
}
