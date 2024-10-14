import { s as projectScheme } from '../models/schema/project.model';
import { s as saleScheme } from '../models/schema/sale.model';
import { s as walletScheme } from '../models/schema/wallet.model';
import { s as networkScheme } from '../models/schema/network.model';
import { s as whitelistScheme } from '../models/schema/whitelist.model';
import { s as tokenScheme } from '../models/schema/token.model';
import { s as transactionScheme } from '../models/schema/transaction.model';
import { s as presaleScheme } from '../models/schema/presale.model';
import { s as projectDraftScheme } from '../models/schema/project-draft.model';
import { s as featuredTokenScheme } from '../models/schema/featured-token.model';
import { s as projectPitchScheme } from '../models/schema/project-pitch.model';
import { s as walletUserInfoScheme } from '../models/schema/wallet-user-infos.model';
import { s as tokenMetricsScheme } from '../models/schema/token-metrics.model';
import { s as followScheme } from '../models/schema/follow.model';
import { s as understandScheme } from '../models/schema/understand.model';
import { s as systemConfigScheme } from '../models/schema/system-config.model'

const environments = ['LCL', 'PRO', 'STG', 'DEV'];

const services = {};

const schemas = {
  projectScheme,
  saleScheme,
  walletScheme,
  networkScheme,
  whitelistScheme,
  tokenScheme,
  transactionScheme,
  presaleScheme,
  projectDraftScheme,
  featuredTokenScheme,
  projectPitchScheme,
  walletUserInfoScheme,
  tokenMetricsScheme,
  followScheme,
  understandScheme,
  systemConfigScheme
}

export {
  environments,
  services,
  schemas,
}
