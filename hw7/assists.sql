USE hw7;
CREATE TABLE assists (
	Player VARCHAR(255) not null,
	Club VARCHAR(255) not null,
	POS VARCHAR(255) not null,
	GP INT not null,
	GS INT not null,
	A INT not null,
	GWA INT not null,
	HmA INT not null,
	RdA INT not null,
	Ap90min FLOAT not null,
	PRIMARY KEY (player)
);
LOAD DATA LOCAL INFILE 'assists.csv'
INTO TABLE assists
FIELDS TERMINATED BY ','
LINES TERMINATED BY'\n' IGNORE 1 ROWS;
