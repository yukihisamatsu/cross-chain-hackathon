import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {getAddress} from "~src/libs/cosmos/util";

export class UserRepository {
  userApi: UserApi;

  constructor({userApi}: {userApi: UserApi}) {
    this.userApi = userApi;
  }

  static create({userApi}: {userApi: UserApi}): UserRepository {
    return new UserRepository({userApi});
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
