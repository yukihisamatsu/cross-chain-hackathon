import {Unbox} from "~src/heplers/util-types";

export const COIN_CHAIN_ID = "coinz";
export const COORDINATOR_CHAIN_ID = "coordinatorz";
export const SECURITY_CHAIN_ID = "securityz";

export const CROSS_COORDINATOR_STATUS = {
  NONE: 0,
  INIT: 1,
  DECIDED: 2
} as const;
export type CrossCoordinatorStatusType = Unbox<typeof CROSS_COORDINATOR_STATUS>;

export const CROSS_COORDINATOR_DECISION = {
  NONE: 3,
  COMMIT: 4,
  ABORT: 5
} as const;
export type CrossCoordinatorDecisionType = Unbox<
  typeof CROSS_COORDINATOR_DECISION
>;

export const CROSS_COORDINATOR_RESULT = {
  PREPARE: "prepare",
  OK: "ok",
  FAILED: "failed"
} as const;
export type CrossCoordinatorResultType = Unbox<typeof CROSS_COORDINATOR_RESULT>;
