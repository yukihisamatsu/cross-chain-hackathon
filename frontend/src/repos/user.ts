import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {CoinContract} from "~src/libs/cosmos/contract/coint";
import {getAddress} from "~src/libs/cosmos/util";
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

    return data.map(({id, name, mnemonic}) => {
      const address = getAddress(mnemonic);

      return {
        id,
        name,
        address,
        mnemonic,
        balance: 0
      };
    });
  };

  getUser = async (userId: string): Promise<User> => {
    const {
      data: {id, name, mnemonic}
    } = await this.userApi.getUser(userId);

    const address = getAddress(mnemonic);

    return {
      id,
      name,
      address,
      mnemonic,
      balance: 0
    };
  };

  balanceOf = async (address: Address): Promise<number> => {
    const balance = await this.coinContract.balanceOf(address);

    return balance.toNumber();
  };
}
