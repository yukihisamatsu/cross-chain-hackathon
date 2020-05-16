import log from "loglevel";

import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {CoinContract} from "~src/libs/cosmos/contract/coin";
import {RestClient} from "~src/libs/cosmos/rest-client";
import {Cosmos} from "~src/libs/cosmos/util";
import {Address} from "~src/types";

export class UserRepository {
  userApi: UserApi;
  coinContract: CoinContract;
  coordinatorRestClient: RestClient;
  securityRestClient: RestClient;

  constructor({
    userApi,
    coinContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }) {
    this.userApi = userApi;
    this.coinContract = coinContract;
    this.coordinatorRestClient = coordinatorRestClient;
    this.securityRestClient = securityRestClient;
  }

  static create({
    userApi,
    coinContract,
    coordinatorRestClient,
    securityRestClient
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
    coordinatorRestClient: RestClient;
    securityRestClient: RestClient;
  }): UserRepository {
    return new UserRepository({
      userApi,
      coinContract,
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
    let balance = -1;
    try {
      balance = (await this.coinContract.balanceOf(address)).toNumber();
    } catch (e) {
      log.error(e);
    }

    return {
      id,
      name,
      address,
      mnemonic,
      balance
    };
  };

  balanceOf = async (address: Address): Promise<number> => {
    const balance = await this.coinContract.balanceOf(address);
    return balance.toNumber();
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
