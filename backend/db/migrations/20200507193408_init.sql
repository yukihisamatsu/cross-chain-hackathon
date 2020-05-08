-- +goose Up
-- +goose StatementBegin
CREATE TABLE user(
	id TEXT PRIMARY KEY,
	name TEXT NOT NULL,
	mnemonic TEXT NOT NULL
);

CREATE TABLE estate(
    tokenId TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    imagePath TEXT NOT NULL,
    description TEXT NOT NULL,
    offerPrice INTEGER NOT NULL,
    expectedYield INTEGER NOT NULL,
    dividendDate DATE NOT NULL,
    issuedBy TEXT NOT NULL,
    FOREIGN KEY(issuedBy) references user(id)
);

CREATE TABLE trade(
    id INTEGER PRIMARY KEY,
    estateId TEXT NOT NULL,
    unitPrice INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    buyer TEXT,
    seller TEXT NOT NULL,
    type TEXT NOT NULL,
    canceled INTEGER NOT NULL DEFAULT 0,
    updatedAt DATETIME NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP)),
    FOREIGN KEY(estateId) references estate(tokenId),
    FOREIGN KEY(buyer) references user(id),
    FOREIGN KEY(seller) references user(id)
);

CREATE TRIGGER trigger_trade_update_at AFTER UPDATE ON trade 
BEGIN
    UPDATE trade SET updatedAt = DATETIME(CURRENT_TIMESTAMP) WHERE rowid = OLD.rowid;
END;

CREATE TABLE trade_request(
    id INTEGER PRIMARY KEY,
    tradeId INTEGER NOT NULL,
    "from" TEXT NOT NULL,
    crossTx BLOB NOT NULL,
    canceled INTEGER NOT NULL DEFAULT 0,
    updatedAt DATETIME NOT NULL DEFAULT (DATETIME(CURRENT_TIMESTAMP)),
    FOREIGN KEY(tradeId) references trade(id),
    FOREIGN KEY("from") references user(id)
);

CREATE TRIGGER trigger_request_update_at AFTER UPDATE ON trade_request 
BEGIN
    UPDATE trade_request SET updatedAt = datetime(CURRENT_TIMESTAMP) WHERE rowid = OLD.rowid;
END;

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE trade_request;
DROP TABLE trade;
DROP TABLE estate;
DROP TABLE user;
-- +goose StatementEnd
