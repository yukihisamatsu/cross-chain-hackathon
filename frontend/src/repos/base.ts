import {AxiosResponse} from "axios";

export abstract class BaseRepo {
  apiRequest = async (promise: () => Promise<AxiosResponse>): Promise<void> => {
    const response = await promise();
    if (response.status !== 200) {
      throw new Error(`response: ${response}`);
    }
  };
}
