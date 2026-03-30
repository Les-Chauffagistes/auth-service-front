"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { components } from "@les-chauffagistes/authentication-types"
import { getMe } from "./api";

export default function Home() {
  const [user, setUser] = useState<components["schemas"]["User"] | null>(null);

  useEffect(() => {
    console.log("heu")
    getMe().then(setUser);
  }, []);

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <p>Hi, {user ? user.pseudo : "Anonymous"}!</p>
      </main>
    </div>
  );
}
