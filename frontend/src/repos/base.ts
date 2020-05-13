import {AxiosResponse} from "axios";

export abstract class BaseRepo {
  apiRequest = async <T>(
    promise: () => Promise<AxiosResponse<T>>
  ): Promise<T> => {
    const response = await promise();
    if (response.status !== 200) {
      throw new Error(`response: ${response}`);
    }
    return response.data;
  };
}
