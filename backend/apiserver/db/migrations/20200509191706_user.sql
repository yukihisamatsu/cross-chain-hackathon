-- +goose Up
-- SQL in this section is executed when the migration is applied.
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02', 'issuer', 'uncle wink forum finish collect midnight capable park fabric quarter seed abuse curve market choice base execute initial bulb title enrich spread exit update');
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos1w9tumxvvxevq5gac5se2uq0s50q7yk9gyyvwe9', 'alice', 'vague domain finger zero service door father scheme immense gravity warfare kiwi park glimpse real twist this crunch loud hello throw camera era stool');
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos1l4ggreypq0gr8n96e7246tsy95pqpyu9zdd498', 'bob', 'basic rotate junk scorpion orient enlist inspire tooth eight hunt loyal rain pitch chaos cart brisk fringe program zero blood electric apart lady walnut');
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos146av9w44gewl25u0g5a73j0m4arqrqlmp06587', 'carol', 'spoon fish dwarf either cattle injury health glow present chicken mouse soft saddle humor voyage fabric brand dumb right rent holiday spice oval ceiling');
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos18rrzm574falcm248w947rcvcd9l90ys4697fl4', 'dave', 'blood sleep illegal kite electric ethics tuna weather gospel ketchup unfair emerge grid unknown defy gun win inspire gate supply script option defense normal');
INSERT INTO user (id, name, mnemonic) VALUES ('cosmos1p2nn86wmr2794vxh9aka835dcc04wh4plkjfd4', 'trudy', 'surge tone recipe boat pudding price sheriff ball slogan asset current file organ shove wise verify describe indoor ability wreck motion drastic increase practice');

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DELETE FROM user;
