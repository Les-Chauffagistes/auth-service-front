import Link from "next/link";
import Image from "next/image";
import { BookOpenText, ChartLineIcon, Users } from "lucide-react";
import styles from "./footer.module.css";
import { COMMUNITY_POOL_ADDRESS, HEATBOARD_URL } from "@/app/constants/columns";

const iconSize = 16;

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.inner}>
                <div className={styles.brand}>
                    <Link href="/pool">
                        <Image src="/brand-icon.png" width={32} height={32} alt="Chauffagistes" style={{ borderRadius: "50%" }} />
                        <h3>Chauffagistes Pool</h3>
                    </Link>
                    <p>
                        Solution de minage Bitcoin française
                    </p>
                </div>

                <div className={styles.category}>
                    <h4>Réseaux</h4>
                    <Link href="https://discord.gg/7fvxDPjRgj" target="_blank">
                        <Image src="/Discord-Symbol-White.svg" width={iconSize} height={iconSize} alt="Discord" />
                        <p>Discord</p>
                    </Link>
                    <Link href="https://x.com/Chauff_pool" target="_blank">
                        <Image src="/x.svg" width={iconSize} height={iconSize} alt="X" />
                        <p>X</p>
                    </Link>
                    <Link href="https://www.youtube.com/@chauffagistes" target="_blank">
                        <Image src="/youtube-app-white-icon.svg" width={iconSize} height={iconSize} alt="YouTube" />
                        <p>YouTube</p>
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>Ressources</h4>
                    <Link href="https://github.com/Les-Chauffagistes" target="_blank">
                        <Image src="/GitHub_Invertocat_Light.svg" width={iconSize} height={iconSize} alt="GitHub" />
                        <p>GitHub</p>
                    </Link>
                    <Link href="https://learn.chauffagistes-btc.fr" target="_blank">
                        <BookOpenText size={iconSize} />
                        <p>Wiki</p>
                    </Link>
                </div>

                <div className={styles.category}>
                    <h4>Services</h4>
                    <Link href={HEATBOARD_URL} target="_blank">
                        <ChartLineIcon size={iconSize} />
                        <p>Dashboard</p>
                    </Link>
                    <Link href={`https://heatboard.chauffagistes-btc.fr/start/${COMMUNITY_POOL_ADDRESS}`} target="_blank">
                        <Users size={iconSize} />
                        <p>Pool Communautaire</p>
                    </Link>
                </div>
            </div>

            <div className={styles.bottom}>
                <p>&copy; 2024 — 2026 Les Chauffagistes</p>
                <p>Bitcoin mining & chaleur utile</p>
            </div>
        </footer>
    );
}
