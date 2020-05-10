-- +goose Up
-- SQL in this section is executed when the migration is applied.
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('1', 'HIgh-rise apartment in Tokyo', '01.jpg', 'A 50-story high-rise apartment building in Tokyo. The apartment is 10 years old and has very good access to Tokyo Station. The redevelopment of the surrounding area is underway, and we can expect land prices to rise in the future.', 1000, 50, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('2', 'Skyscraper in Singapore', '02.jpg', 'A skyscraper currently under construction in Singapore. It is an extremely popular building whose tenants are already filled with a number of foreign companies, and the recruitment is expected to be completed by the end of this summer.', 2000, 150, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('3', 'Resort in Hakone', '03.jpg', 'This hotel is located in Hakone, one of Japan''s most famous hot spring areas. Hakone is very popular with tourists from all over the world every year. This property has been decided to be rebuilt.', 500, 20, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('4', 'Resort in Hawaii', '04.jpg', 'A famous Resort in Hawaii. Although it is over 30 years old, it is very popular and always difficult to book.', 800, 40, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('5', 'Resort in Maldives', '05.jpg', 'The most popular resort in the Maldives. The building sits on top of the ocean, so you can enjoy 360-degree ocean views. Because of this, it is very popular with the wealthy, although the price of accommodation is expensive.', 500, 23, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');
INSERT INTO estate (tokenId, name, imagePath, description, offerPrice, expectedYield, dividendDate, issuedBy) VALUES ('6', 'Tower blocks in HongKong', '06.jpg', '60-story tower blocks in Hong Kong. The lower floor is a shopping mall and the upper floor is used as offices for many famous companies.', 1000, 55, '2020-11-14', 'cosmos1yk0x4pqcwyuxtrsd8nqz2x0xd3ucafed96wd02');

-- +goose Down
-- SQL in this section is executed when the migration is rolled back.
DELETE FROM estate;