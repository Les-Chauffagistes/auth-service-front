"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { components } from "@les-chauffagistes/authentication-types"
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
          <p>Not logged in</p>
          <LinkWithSearchParams
            href="/login"
          >Login</LinkWithSearchParams>
        </>
        }
        {user && <>
          <p>Logged in as {user.pseudo}</p>
          <button onClick={async () => await logOut()}>Logout</button>
        </>
        }
      </div>
    </div>
  );
}
