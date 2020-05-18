import log from "loglevel";

import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {CoinContract} from "~src/libs/cosmos/contract/coin";
import {EstateContract} from "~src/libs/cosmos/contract/estate";
import {RestClient} from "~src/libs/cosmos/rest-client";
import {Cosmos} from "~src/libs/cosmos/util";
import {Address} from "~src/types";

const ISSUER_ADDRESS = "cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02";

export class UserRepository {
  userApi: UserApi;
  coinContract: CoinContract;
  estateContract: EstateContract;
  coordinatorRestClient: RestClient;
  securityRestClient: RestClient;

  constructor({
    userApi,
    coinContract,
    estateContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
    estateContract: EstateContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }) {
    this.userApi = userApi;
    this.coinContract = coinContract;
    this.estateContract = estateContract;
    this.coordinatorRestClient = coordinatorRestClient;
    this.securityRestClient = securityRestClient;
  }

  static create({
    userApi,
    coinContract,
    estateContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
    estateContract: EstateContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }): UserRepository {
    return new UserRepository({
      userApi,
      coinContract,
      estateContract,
      coordinatorRestClient,
      securityRestClient
    });
  }

  getUsers = async (): Promise<User[]> => {
    const {data} = await this.userApi.getUsers();
    return await Promise.all(data.map(this.toModelUser));
  };

  getUser = async (userId: string): Promise<User> => {
    const {data} = await this.userApi.getUser(userId);
    return await this.toModelUser(data);
  };

  private toModelUser = async ({
    id,
    name,
    mnemonic
  }: {
    id: string;
    name: string;
    mnemonic: string;
  }) => {
    const address = Cosmos.getAddress(mnemonic);
    let balance = 0;
    try {
      balance = await this.balanceOf(address);
    } catch (e) {
      log.error(e);
    }

    let isWhitelisted: boolean;
    try {
      isWhitelisted = await this.isWhitelisted(address);
    } catch (e) {
      log.error(e);
      isWhitelisted = false;
    }

    return {
      id,
      name,
      address,
      mnemonic,
      balance,
      isWhitelisted
    };
  };

  balanceOf = async (address: Address): Promise<number> => {
    return (await this.coinContract.balanceOf(address)).toNumber();
  };

  isWhitelisted = async (self: Address): Promise<boolean> => {
    let isWhitelisted: boolean;
    try {
      isWhitelisted = await this.estateContract.isWhitelisted(
        self,
        ISSUER_ADDRESS
      );
    } catch (e) {
      log.error(e);
      isWhitelisted = false;
    }
    return isWhitelisted;
  };

  getAuthAccountCoordinator = async (
    address: Address
  ): Promise<{accountNumber: string; sequence: string}> => {
    const {
      result: {
        value: {account_number, sequence}
      }
    } = await this.coordinatorRestClient.authAccounts(address)();
    return {
      accountNumber: account_number ?? "0",
      sequence: sequence ?? "0"
    };
  };

  getAuthAccountSecurity = async (
    address: Address
  ): Promise<{accountNumber: string; sequence: string}> => {
    const {
      result: {
        value: {account_number, sequence}
      }
    } = await this.securityRestClient.authAccounts(address)();
    return {
      accountNumber: account_number ?? "0",
      sequence: sequence ?? "0"
    };
  };
}
