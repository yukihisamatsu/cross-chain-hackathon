# Prerequisites

Start up your application by docker-compose.

```
$ cd ../
$ docker-compose up
```

You also need to add some user keys for signing a tx with simappcli.
The following commands require each user's mnemonic and passphrase.

```
$ simappcli keys add alice --home ../data/cli/alice --keyring-backend test -i
$ simappcli keys add bob --home ../data/cli/bob --keyring-backend test -i
```

FYI: check `backend/apiserver/db/initdata/user.csv` to see the mnemonics of the default users.

# Test

```
$ cd ../
$ ./tests/tx.sh
```

This shows the tx hash, its MsgInitiate tx ID and the final status.
