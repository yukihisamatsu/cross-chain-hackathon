import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {CoinContract} from "~src/libs/cosmos/contract/coin";
import {Cosmos} from "~src/libs/cosmos/util";
import {Address} from "~src/types";

export class UserRepository {
  userApi: UserApi;
  coinContract: CoinContract;

  constructor({
    userApi,
    coinContract
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
  }) {
    this.userApi = userApi;
    this.coinContract = coinContract;
  }

  static create({
    userApi,
    coinContract
  }: {
    userApi: UserApi;
    coinContract: CoinContract;
  }): UserRepository {
    return new UserRepository({userApi, coinContract});
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
    const balance = (await this.coinContract.balanceOf(address)).toNumber();

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
}
