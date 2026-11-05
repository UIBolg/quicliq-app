/** Demo transfers + in-memory changes made in this session (cancelling a pending transfer), shared by Home, 11.1 and 11.3. */
import { useSyncExternalStore } from 'react';
import { demoTransfers } from '@shared/mock/account';
import { demoTransferDetails, type TransferDetail, type TransferStatus } from '@shared/mock/transfers';

export type Transfer = Omit<(typeof demoTransfers)[number], 'status'> & { status: TransferStatus; detail: TransferDetail };

let overrides: Record<string, { status: TransferStatus; detail: TransferDetail }> = {};
const listeners = new Set<() => void>();
const build = (): Transfer[] => demoTransfers.map((tx) => ({ ...tx, detail: demoTransferDetails[tx.id], ...(overrides[tx.id] as Partial<Transfer> | undefined) }));
let snapshot = build();

export function useTransfers(): Transfer[] {
  return useSyncExternalStore((l) => { listeners.add(l); return () => listeners.delete(l); }, () => snapshot);
}

/** Sender cancels a pending transfer: adds `cancelled` now and a refund expected in 3 working days. */
export function cancelTransfer(tx: Transfer, now: string, refundBy: string) {
  overrides = { ...overrides, [tx.id]: { status: 'cancelled', detail: { ...tx.detail, eta: refundBy, events: [...tx.detail.events, { status: 'cancelled', at: now }] } } };
  snapshot = build();
  listeners.forEach((l) => l());
}
