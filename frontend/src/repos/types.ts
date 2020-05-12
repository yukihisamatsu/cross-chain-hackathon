import {EstateRepository} from "~src/repos/estate";
import {OrderRepository} from "~src/repos/order";
import {UserRepository} from "~src/repos/user";

export type Repositories = {
  userRepo: UserRepository;
  estateRepo: EstateRepository;
  orderRepo: OrderRepository;
};
