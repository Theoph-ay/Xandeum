import { Connection } from '@solana/web3.js';
// @ts-ignore
import * as xandeum from '@xandeum/web3.js';

// Devnet endpoint
const XANDEUM_RPC_ENDPOINT = 'https://api.devnet.xandeum.com:8899';

export interface PNode {
    pubkey: string;
    gossip_addr: string;
    tpu_addr: string;
    rpc_addr: string;
    version: string;
    feature_set: number;
    shred_version: number;
}

export class XandeumService {
    connection: Connection;

    constructor() {
        this.connection = new Connection(XANDEUM_RPC_ENDPOINT, 'confirmed');
    }

    async getPNodeList(): Promise<PNode[]> {
        try {
            console.log('Connecting to Xandeum RPC:', XANDEUM_RPC_ENDPOINT);

            // Attempt to find the right method for pNodes in gossip
            // Xandeum extends Solana's web3.js, so check for custom methods if available
            // or use standard getClusterNodes which often includes gossip info

            const nodes = await this.connection.getClusterNodes();

            console.log('Retrieved nodes:', nodes);

            // Filter or map if necessary - for now we return all found nodes
            // In a real Xandeum specific RPC, we might use xandeum-specific calls.
            // If xandeum.web3.js adds methods to Connection prototype, they might be here.

            return nodes.map((n: any) => ({
                pubkey: n.pubkey,
                gossip_addr: n.gossip || 'N/A',
                tpu_addr: n.tpu || 'N/A',
                rpc_addr: n.rpc || 'N/A',
                version: n.version || 'Unknown',
                feature_set: n.featureSet || 0,
                shred_version: n.shredVersion || 0
            }));

        } catch (error) {
            console.error('Error fetching pNodes:', error);
            throw error;
        }
    }

    // Debug helper to inspect the connection object for Xandeum specific methods
    logConnectionMethods() {
        console.log('Connection object keys:', Object.keys(this.connection));
        // @ts-ignore
        console.log('Connection prototype:', Object.getPrototypeOf(this.connection));
    }
}

export const xandeumService = new XandeumService();
