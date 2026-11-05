/**
 * Transfer details (11.3) for the demo transfers in ./account.ts: payout details, card used, pickup code and the
 * status timeline. Times are ISO (UK time, Z offset kept simple for the demo). Copy comes from `transfer.*` in i18n.
 *
 * Lifecycle (bank):  created → paid → review → sent → delivered
 * Lifecycle (cash):  created → paid → review → ready → collected
 * Either can stop at any step with `rejected` (by Quicliq / the payout partner) or `cancelled` (by the sender or
 * automatically), always followed by `refunded`.
 */
import { demoAccount, demoTransfers } from './account';

/** List statuses: Pending → Processing → Delivered, or Cancelled / Rejected (always with a reason). A cash transfer that is
 *  ready to collect is still Processing until it is collected (the timeline shows the "Ready to collect" step). */
export type TransferStatus = 'pending' | 'processing' | 'delivered' | 'rejected' | 'cancelled';
export type TransferStep = 'created' | 'paid' | 'review' | 'sent' | 'delivered' | 'ready' | 'collected' | 'rejected' | 'cancelled' | 'refunded';
/** Why a transfer stopped. `by*` reasons are the sender's own cancellation choices (also offered in the cancel sheet). */
export type StopReason = 'nameMismatch' | 'compliance' | 'notCollected' | 'byWrongAmount' | 'byWrongRecipient' | 'byChangedMind' | 'byOther';
export const cancelReasons = ['byWrongAmount', 'byWrongRecipient', 'byChangedMind', 'byOther'] as const;

export type TransferEvent = { step: TransferStep; at: string };
export type TransferDetail = {
  reference: string;
  fee: number;
  cardId: 'c1' | 'c2';
  /** Bank: bank key (transfer.banks) + last 4 of the IBAN. Cash: pickup agent key (transfer.agents). */
  payout: { bank: 'arab' | 'housing' | 'cairoAmman'; last4: string } | { agent: 'abdali' | 'irbid' };
  events: TransferEvent[];
  /** When the next step (or the refund) is expected, for transfers that are still moving. */
  eta?: string;
  reason?: StopReason;
  pickupCode?: string;
};

export const stepsFor = (method: 'bank' | 'cash'): TransferStep[] =>
  method === 'bank' ? ['created', 'paid', 'review', 'sent', 'delivered'] : ['created', 'paid', 'review', 'ready', 'collected'];

export const demoTransferDetails: Record<(typeof demoTransfers)[number]['id'], TransferDetail> = {
  t8: { reference: 'QLQ-8F3K2M', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' }, eta: '2026-11-03T10:00',
    events: [{ step: 'created', at: '2026-11-03T09:12' }, { step: 'paid', at: '2026-11-03T09:12' }] },
  t3: { reference: 'QLQ-7D1P9A', fee: 2.99, cardId: 'c1', payout: { bank: 'housing', last4: '1093' }, eta: '2026-11-03T18:00',
    events: [{ step: 'created', at: '2026-11-02T16:40' }, { step: 'paid', at: '2026-11-02T16:41' }, { step: 'review', at: '2026-11-02T17:05' }, { step: 'sent', at: '2026-11-02T17:06' }] },
  t9: { reference: 'QLQ-6C8R4T', fee: 3.99, cardId: 'c2', payout: { agent: 'abdali' }, pickupCode: '7314 2208', eta: '2026-12-01T23:59',
    events: [{ step: 'created', at: '2026-11-01T11:20' }, { step: 'paid', at: '2026-11-01T11:20' }, { step: 'review', at: '2026-11-01T11:34' }, { step: 'ready', at: '2026-11-01T11:35' }] },
  t1: { reference: 'QLQ-5B2N7W', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' },
    events: [{ step: 'created', at: '2026-10-28T08:55' }, { step: 'paid', at: '2026-10-28T08:55' }, { step: 'review', at: '2026-10-28T09:10' }, { step: 'sent', at: '2026-10-28T09:11' }, { step: 'delivered', at: '2026-10-28T13:47' }] },
  t10: { reference: 'QLQ-4A9H3E', fee: 2.99, cardId: 'c1', payout: { bank: 'cairoAmman', last4: '5520' }, reason: 'nameMismatch',
    events: [{ step: 'created', at: '2026-10-20T14:02' }, { step: 'paid', at: '2026-10-20T14:02' }, { step: 'review', at: '2026-10-20T14:30' }, { step: 'sent', at: '2026-10-20T14:31' }, { step: 'rejected', at: '2026-10-21T10:15' }, { step: 'refunded', at: '2026-10-23T09:00' }] },
  t2: { reference: 'QLQ-3Z6Q1L', fee: 3.99, cardId: 'c2', payout: { agent: 'irbid' }, pickupCode: '5108 6643',
    events: [{ step: 'created', at: '2026-10-14T18:20' }, { step: 'paid', at: '2026-10-14T18:20' }, { step: 'review', at: '2026-10-14T18:31' }, { step: 'ready', at: '2026-10-14T18:32' }, { step: 'collected', at: '2026-10-15T12:05' }] },
  t11: { reference: 'QLQ-2Y4V8S', fee: 3.99, cardId: 'c1', payout: { agent: 'abdali' }, reason: 'byWrongAmount',
    events: [{ step: 'created', at: '2026-10-06T19:44' }, { step: 'paid', at: '2026-10-06T19:44' }, { step: 'cancelled', at: '2026-10-06T19:51' }, { step: 'refunded', at: '2026-10-08T09:00' }] },
  t4: { reference: 'QLQ-1X7U5J', fee: 2.99, cardId: 'c1', payout: { bank: 'housing', last4: '7764' },
    events: [{ step: 'created', at: '2026-09-21T10:00' }, { step: 'paid', at: '2026-09-21T10:00' }, { step: 'review', at: '2026-09-21T10:12' }, { step: 'sent', at: '2026-09-21T10:13' }, { step: 'delivered', at: '2026-09-21T15:20' }] },
  t5: { reference: 'QLQ-0W3T2G', fee: 3.99, cardId: 'c2', payout: { agent: 'irbid' }, pickupCode: '2290 4417',
    events: [{ step: 'created', at: '2026-09-09T12:30' }, { step: 'paid', at: '2026-09-09T12:30' }, { step: 'review', at: '2026-09-09T12:41' }, { step: 'ready', at: '2026-09-09T12:42' }, { step: 'collected', at: '2026-09-10T10:18' }] },
  t6: { reference: 'QLQ-9V1S6D', fee: 2.99, cardId: 'c1', payout: { bank: 'arab', last4: '4821' },
    events: [{ step: 'created', at: '2026-08-27T09:05' }, { step: 'paid', at: '2026-08-27T09:05' }, { step: 'review', at: '2026-08-27T09:20' }, { step: 'sent', at: '2026-08-27T09:21' }, { step: 'delivered', at: '2026-08-27T14:02' }] },
  t12: { reference: 'QLQ-8U5R0C', fee: 3.99, cardId: 'c2', payout: { agent: 'abdali' }, pickupCode: '6621 0937', reason: 'notCollected',
    events: [{ step: 'created', at: '2026-08-18T17:10' }, { step: 'paid', at: '2026-08-18T17:10' }, { step: 'review', at: '2026-08-18T17:22' }, { step: 'ready', at: '2026-08-18T17:23' }, { step: 'cancelled', at: '2026-09-17T23:59' }, { step: 'refunded', at: '2026-09-19T09:00' }] },
  t7: { reference: 'QLQ-7T9P4B', fee: 3.99, cardId: 'c1', payout: { agent: 'irbid' }, pickupCode: '3047 7712',
    events: [{ step: 'created', at: '2026-08-11T13:15' }, { step: 'paid', at: '2026-08-11T13:15' }, { step: 'review', at: '2026-08-11T13:27' }, { step: 'ready', at: '2026-08-11T13:28' }, { step: 'collected', at: '2026-08-12T16:40' }] },
};

/** Recipient gets the sent amount (fee is on top) converted at the demo GBP → JOD rate. */
export const receiveAmount = (amount: number) => Math.round(amount * Number(demoAccount.rate.jod) * 100) / 100;
