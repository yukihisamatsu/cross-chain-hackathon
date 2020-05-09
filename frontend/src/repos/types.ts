import {EstateRepository} from "~src/repos/estate";
import {UserRepository} from "~src/repos/user";

export type Repositories = {
  userRepo: UserRepository;
  estateRepo: EstateRepository;
};
