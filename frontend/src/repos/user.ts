import {User} from "~models/user";
import {UserApi} from "~src/libs/api";
import {getAddress, getECPairPriv} from "~src/libs/cosmos/util";

export class UserRepository {
  userApi: UserApi;

  constructor({userApi}: {userApi: UserApi}) {
    this.userApi = userApi;
  }

  static create({userApi}: {userApi: UserApi}): UserRepository {
    return new UserRepository({userApi});
  }

  getUser = async (userId: string): Promise<User> => {
    const {
      data: {id, name, mnemonic}
    } = await this.userApi.getUser(userId);

    const address = getAddress(mnemonic);
    const privateKey = getECPairPriv(mnemonic);

    return {
      id,
      name,
      address,
      privateKey
    };
  };
}
