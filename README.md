## Motivation

The tokenization of real estate securities is the latest trend. By representing securities as tokens on the blockchain, we are trying to build a new funding platform that can reduce administrative costs, such as rewriting legal books. In the future, we improve liquidity efficiency by automating the transfer, dividend, and redemption processes using digital currencies such as CBDC.

However, there are some issues which we must solve to achieve this. Securities are not freely transferable to anyone like Currency, and the transferability of securities always changes depending on various conditions.

We have to check some conditions before finishing the exchange.
For example, we must make sure that the number of people who hold the security is not over the limit, or whether the investors have completed KYC. Besides, once the transfer of the securities is consummated, the right to receive dividends will also take over. In other words, when there is a securities chain and a currency chain, we always have to know who is holding the securities in the securities chain and to properly execute the dividend in the currency chain according to the ownership status of the securities token.

Therefore, the two-way-peg method, as defined in ICS-20, which is often used for transfers between different chains of currencies, cannot meet the requirements.

Therefore, we thought that the smart contract between the two blockchains should be executed atomically, limiting the security tokens to transfers within the security chain and the currencies as well.

To solve such problem, we need to be able to execute All or Nothing reservation contracts that exist in two different chains, rather than pegging to single blockchain.

For this reason, we decided to develop Cross Framework and take the approach of applying it.
Cross Framework spec is the following: https://github.com/datachainlab/cross

## Conditions

The marketplace we've developed is a DApp that runs on two blockchains, two blockchains being a security chain, and a currency chain. Security tokens are minted on the security chain, and the currency as well.
It also manages the ownership of securities on the security chain and the dividend rights tied to it.
On the currency chain, it manages the currency used to settle securities.
Besides, the market price of the currency deployed on the currency chain is fixed at this time.
Our main scope is to use Cross Framework to realize AtomicSwap between two blockchains under various conditions and to realize further dividends atomically.
Therefore, the following other features are removed from the implementation scope.

1. Don't mint a new security token on the security chain and a new currency on the currency chain
2. Investors cannot make any offer to buy when the security that they want is not available for sale.


## What can I do with it

For Investor;
On the marketplace of real estate securities we've built, you can buy securities that are up for sale. You can also put your securities up for sale.
Important points are the following.


1. Realize AtomicSwap of securities tokens deployed on the securities chain and currency deployed on the currency chain
2. In 1., if the transaction is with a non-whitelisted investor managed by a smart contract on the securities chain, it will fail atomically. 
3. In 1., if the number of users holding the security managed by a smart contract on the security chain exceeds the limit, it will fail atomically.

For Issuer:
On the marketplace for real estate securities, you can register the dividends and vest the dividend rights. You can then grant dividends to investors who are entitled to them.
An important point is the following.


1. You can atomically distribute to the users who have dividend rights in the securities chain, in the currency chain.


## How we built it


![](https://paper-attachments.dropbox.com/s_0F6DCD9685A7E550C85AE36247CF7CA12491C4098A16C1FA21E01D92F5F393C2_1589170509476_pattern2.png)


We use Cross Framework to perform the smart contracts atomically between the security chain and the currency chain.

### What is Cross Framework?

The following is excerpts from protocol description about Cross Framework:
https://github.com/datachainlab/cross/blob/master/docs/spec/01_basic.md


Cross is a framework that enables the development of smart contracts that support Cross-chain transaction. Cross-chain transaction is a transaction that atomically executes multiple smart contracts on different blockchains.
To achieve Cross-chain transaction, it is necessary to execute ALL or Nothing transaction on multiple networks. This is called Atomic commit in a distributed system. A common protocol for achieving this is Two phase commit (2PC).
We defined requirements to achieve Cross-chain transaction between networks connected by ics-004 with classic 2PC. There are some prior art such as "Dang et al.(2018) Towards Scaling Blockchain Systems via Sharding". It is assumed that bellow properties are required to achieve 2PC on Cross-chain as with the research of Dang et al.

1. Safety for general blockchain transactions
2. Liveness against malicious coordinators

We use Two-phase locking protocol to achieve 1. Therefore, Contract state machine must have "Lock" and "Unlock" state.
It is known that 2PC can be a blocking protocol when Coordinator fails. Therefore, in order to achieve 2, we use a blockchain network that executes BFT consensus as a coordinator.
To achieve Cross-chain transaction, we implemented above requirements. 2PC execution flow of Cross-chain transaction is shown below. Note that the number of participants is 3(A,B,C) and Coordinator is not included in Participants.


![packet-flow.png](https://github.com/datachainlab/cross/blob/master/docs/images/packet-flow.png?raw=true)


### Apply Cross Framework to this Use Case

We will explain Cross by applying it to our use case, the Cross-chain Atomic Swap between the security chain and the currency chain.
In this demo, we have prepared a coordinator chain that is separate from the Security and Currency Chain to execute the cross-chain transaction. However, the Coordinator Chain is no longer needed once the implementation of ics-009 is complete.

https://github.com/cosmos/ics/tree/master/spec/ics-009-loopback-client

![](https://paper-attachments.dropbox.com/s_0F6DCD9685A7E550C85AE36247CF7CA12491C4098A16C1FA21E01D92F5F393C2_1589170870374_workflow.png)



1. Create a cross-chain transaction on Dapp to execute the transfer of security tokens on the security chain and that of currency on the currency chain. Then, attach the signatures of the parties to the transaction
2. Broadcast a cross-chain transaction to Coordinator chain (hereafter, Coordinator).
3. The Coordinator who receives the cross-chain transaction will multicast PrepareCommit to the security and currency chain.
4. Each chain receives a PrepareCommit via Relayer, verifies whether Tx is valid or not, and, if so, saves the operation in the store and locks the relevant key. Then, they return the validation result to the Coordinator as PacketPrepareAcknowledgement.
    1. Check whether the two conditions are met on the security chain.
        1. the users are in the whitelist of KYC
        2. the number of users holding the security does not exceed the limit
    2. Check that the buyer has the payment equivalent currency balance on the currency chain
5. The Coordinator multicasts CommitPacket to both chains based on the results received from the security and currency chains. In this case, the status is divided into two as follows.
    1. if either of PrepareCommit is invalid, the Status is Abort
    2. if both of PrepareCommit is valid, the Status is Commit
6. The security and the currency chain that received the CommitPacket perform the following actions according to the Status of the Commit Packet and return the execution result as PacketCommitAcknowledgement.
    1. If it is Abort, the process stored in the store is discarded and unlocked.
    2. If it is Commit, commit the process stored in the store and unlock its key.
