import {DividendRepository} from "~src/repos/dividend";
import {EstateRepository} from "~src/repos/estate";
import {OrderRepository} from "~src/repos/order";
import {UserRepository} from "~src/repos/user";

export type Repositories = {
  dividendRepo: DividendRepository;
  estateRepo: EstateRepository;
  orderRepo: OrderRepository;
  userRepo: UserRepository;
};
