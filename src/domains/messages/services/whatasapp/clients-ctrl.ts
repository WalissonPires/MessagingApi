import { Client } from "whatsapp-web.js";
import { Status } from "../messaging";

export abstract class WhatsAppClientsCtrl {

    private static _clients: Record<string, ClientMeta> = {};

    public static getClientMeta(clientId: string): ClientMeta | null {

        return this._clients[clientId] ?? null;
    }

    public static saveClientMeta(meta: ClientMeta) {

        this._clients[meta.clientId] = meta;
    }
}


export interface ClientMeta {
    clientId: string;
    client: Client;
    status: Status;
    lastQrCode?: string;
    lastError?: string;
}