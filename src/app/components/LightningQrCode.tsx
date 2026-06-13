"use client";

import {components} from '@les-chauffagistes/authentication-types';
import {ExternalLink, QrCode} from 'lucide-react';
import {QRCodeSVG} from 'qrcode.react';
import {exchangeCode} from '../api';
import {config} from "@/lib/config";

type LightningQrCodeProps = {
    challenge: components["schemas"]["LNChallenge"] | null,
    onLogin: (payload: components["schemas"]["ExchangeCodePayload"]) => void
}

export default function LightningQrCode({challenge, onLogin}: Readonly<LightningQrCodeProps>) {
    let lnurl: string | null = null
    if (challenge) {
        lnurl = `lightning:${challenge.lnurl}`
        const ws = new WebSocket(`${config.AUTH_API_URL}/lightning/ws?k1=${challenge.k1}`);
        ws.onmessage = (ev) => {
            const data: components["schemas"]["LNCallbackSuccessPayload"] = JSON.parse(ev.data)
            exchangeCode(data.code).then(payload => onLogin(payload));
        }
    }
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: "1rem"
        }}>
            <div style={{
                display: "flex",
                width: "fit-content",
                margin: "0 auto",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "white",
                padding: 10,
                borderRadius: 10,
            }}>
                {lnurl && <QRCodeSVG value={lnurl} width="100%"/>}
                {!lnurl && <QrCode color="var(--orange)" size={32}/>}
            </div>
            <a target="_blank" href={lnurl || ""}>
                <button className="primary" style={{display: "flex", margin: "0 auto", gap: 10}}>
                    <ExternalLink size={16}/>
                    <p>Ouvrir</p>
                </button>
            </a>
        </div>
    )
}