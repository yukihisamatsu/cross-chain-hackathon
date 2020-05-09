import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {RPCClient} from "~src/libs/cosmos/rpc-client";
import {getAddress} from "~src/libs/cosmos/util";

export class UserRepository {
  userApi: UserApi;
  coinRPCClient: RPCClient;
  securityRPCClient: RPCClient;

  constructor({
    userApi,
    coinRPCClient,
    securityRPCClient
  }: {
    userApi: UserApi;
    coinRPCClient: RPCClient;
    securityRPCClient: RPCClient;
  }) {
    this.userApi = userApi;
    this.coinRPCClient = coinRPCClient;
    this.securityRPCClient = securityRPCClient;
  }

  static create({
    userApi,
    coinRPCClient,
    securityRPCClient
  }: {
    userApi: UserApi;
    coinRPCClient: RPCClient;
    securityRPCClient: RPCClient;
  }): UserRepository {
    return new UserRepository({userApi, coinRPCClient, securityRPCClient});
  }

  getUsers = async (): Promise<User[]> => {
    const {data} = await this.userApi.getUsers();

    return data.map(({id, name, mnemonic}) => {
      const address = getAddress(mnemonic);

      return {
        id,
        name,
        address,
        mnemonic
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
      mnemonic
    };
  };
}
