/** Maps a demo transfer to TransferRow props (shared by Home "Recent transfers" and 11.1 Activity). */
import type { TFunction } from 'i18next';
import type { TransferRowProps } from '../../components';
import type { demoTransfers } from '../../mock/account';
import { formatMoney, ltr } from '../../utils/format';

type Transfer = (typeof demoTransfers)[number];

export const transferCardProps = (tx: Transfer, tr: TFunction): Omit<TransferRowProps, 'onPress'> => ({
  name: tr(`home.recipientNames.${tx.recipient}`),
  method: tx.method,
  methodLabel: tr(`home.methods.${tx.method}`),
  date: ltr(tx.date),
  amount: formatMoney(Number(tx.amount), 'GBP', { decimals: 'always' }),
  status: tx.status,
  statusLabel: tr(`home.status.${tx.status}`),
});
