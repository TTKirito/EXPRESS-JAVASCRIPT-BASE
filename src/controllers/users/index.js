import { ProjectController } from './project.controller';
import { TokenController } from './token.controller';
import { WalletController } from './wallet.controller';
import { NetworkController } from './network.controller';
import { PresaleController } from './presale.controller';
import { ExchangeController } from './exchange.controller';
import { FeaturedTokenController } from './featured-token.controller';
import { WalletUserInfoController } from "./wallet-user-info.controller";
import { LiquidityController } from "./liquidity.controller";
import { AdminConfigController } from "./admin-config.controller";

const prefix = 'user';

const controllers = [
  ProjectController,
  TokenController,
  WalletController,
  NetworkController,
  PresaleController,
  ExchangeController,
  FeaturedTokenController,
  WalletUserInfoController,
  LiquidityController,
  AdminConfigController
];

export {
  prefix,
  controllers,
}
