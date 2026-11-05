/**
 * Transfer details (11.3) for the demo transfers in ./account.ts: payout details, card used, pickup code and the
 * status timeline. Copy comes from `transfer.*` in i18n.
 *
 * Statuses (the only ones used, list and timeline): Pending → Processing → Delivered, or Cancelled / Rejected with a
 * reason. A cash transfer is Delivered when the money is ready for the recipient to collect at the pickup point.
 * A refund after Cancelled / Rejected is shown as a note, not as a status.
 */
import { demoAccount, demoTransfers } from './account';

export type TransferStatus = 'pending' | 'processing' | 'delivered' | 'rejected' | 'cancelled';
/** Why a transfer stopped. `by*` reasons are the sender's own cancellation choices (also offered in the cancel sheet). */
export type StopReason = 'nameMismatch' | 'compliance' | 'notCollected' | 'byWrongAmount' | 'byWrongRecipient' | 'byChangedMind' | 'byOther';
export const cancelReasons = ['byWrongAmount', 'byWrongRecipient', 'byChangedMind', 'byOther'] as const;
export const statusFlow: TransferStatus[] = ['pending', 'processing', 'delivered'];

/** When the transfer entered each status (local time). */
export type TransferEvent = { status: TransferStatus; at: string };
export type TransferDetail = {
  reference: string;
  fee: number;
  cardId: 'c1' | 'c2';
  /** Bank: bank key (transfer.banks) + last 4 of the IBAN. Cash: pickup agent key (transfer.agents). */
  payout: { bank: 'arab' | 'housing' | 'cairoAmman'; last4: string } | { agent: 'abdali' | 'irbid' };
  events: TransferEvent[];
  /** Pending / Processing: when the next status is expected. Cancelled / Rejected: when the refund is expected. */
  eta?: string;
  reason?: StopReason;
  /** Cancelled / Rejected: when the money was back on the card. */
  refundedAt?: string;
  pickupCode?: string;
};

export const demoTransferDetails: Record<(typeof demoTransfers)[number]['id'], TransferDetail> = {
  t8: { reference: 'QLQ-8F3K2M', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' }, eta: '2026-11-03T10:00',
    events: [{ status: 'pending', at: '2026-11-03T09:12' }] },
  t3: { reference: 'QLQ-7D1P9A', fee: 2.99, cardId: 'c1', payout: { bank: 'housing', last4: '1093' }, eta: '2026-11-03T18:00',
    events: [{ status: 'pending', at: '2026-11-02T16:40' }, { status: 'processing', at: '2026-11-02T17:05' }] },
  t9: { reference: 'QLQ-6C8R4T', fee: 3.99, cardId: 'c2', payout: { agent: 'abdali' }, pickupCode: '7314 2208',
    events: [{ status: 'pending', at: '2026-11-01T11:20' }, { status: 'processing', at: '2026-11-01T11:34' }, { status: 'delivered', at: '2026-11-01T11:35' }] },
  t1: { reference: 'QLQ-5B2N7W', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' },
    events: [{ status: 'pending', at: '2026-10-28T08:55' }, { status: 'processing', at: '2026-10-28T09:10' }, { status: 'delivered', at: '2026-10-28T13:47' }] },
  t10: { reference: 'QLQ-4A9H3E', fee: 2.99, cardId: 'c1', payout: { bank: 'cairoAmman', last4: '5520' }, reason: 'nameMismatch', refundedAt: '2026-10-23T09:00',
    events: [{ status: 'pending', at: '2026-10-20T14:02' }, { status: 'processing', at: '2026-10-20T14:30' }, { status: 'rejected', at: '2026-10-21T10:15' }] },
  t2: { reference: 'QLQ-3Z6Q1L', fee: 3.99, cardId: 'c2', payout: { agent: 'irbid' }, pickupCode: '5108 6643',
    events: [{ status: 'pending', at: '2026-10-14T18:20' }, { status: 'processing', at: '2026-10-14T18:31' }, { status: 'delivered', at: '2026-10-14T18:32' }] },
  t11: { reference: 'QLQ-2Y4V8S', fee: 3.99, cardId: 'c1', payout: { agent: 'abdali' }, reason: 'byWrongAmount', refundedAt: '2026-10-08T09:00',
    events: [{ status: 'pending', at: '2026-10-06T19:44' }, { status: 'cancelled', at: '2026-10-06T19:51' }] },
  t4: { reference: 'QLQ-1X7U5J', fee: 2.99, cardId: 'c1', payout: { bank: 'housing', last4: '7764' },
    events: [{ status: 'pending', at: '2026-09-21T10:00' }, { status: 'processing', at: '2026-09-21T10:12' }, { status: 'delivered', at: '2026-09-21T15:20' }] },
  t5: { reference: 'QLQ-0W3T2G', fee: 3.99, cardId: 'c2', payout: { agent: 'irbid' }, pickupCode: '2290 4417',
    events: [{ status: 'pending', at: '2026-09-09T12:30' }, { status: 'processing', at: '2026-09-09T12:41' }, { status: 'delivered', at: '2026-09-09T12:42' }] },
  t6: { reference: 'QLQ-9V1S6D', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' },
    events: [{ status: 'pending', at: '2026-08-27T09:05' }, { status: 'processing', at: '2026-08-27T09:20' }, { status: 'delivered', at: '2026-08-27T14:02' }] },
  t12: { reference: 'QLQ-8U5R0C', fee: 3.99, cardId: 'c2', payout: { agent: 'abdali' }, reason: 'notCollected', refundedAt: '2026-09-19T09:00',
    events: [{ status: 'pending', at: '2026-08-18T17:10' }, { status: 'processing', at: '2026-08-18T17:22' }, { status: 'cancelled', at: '2026-09-17T23:59' }] },
  t7: { reference: 'QLQ-7T9P4B', fee: 3.99, cardId: 'c1', payout: { agent: 'irbid' }, pickupCode: '3047 7712',
    events: [{ status: 'pending', at: '2026-08-11T13:15' }, { status: 'processing', at: '2026-08-11T13:27' }, { status: 'delivered', at: '2026-08-11T13:28' }] },
};

/** Recipient gets the sent amount (fee is on top) converted at the demo GBP → JOD rate. */
export const receiveAmount = (amount: number) => Math.round(amount * Number(demoAccount.rate.jod) * 100) / 100;
