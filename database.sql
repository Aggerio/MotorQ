-- Create the Org table
CREATE TABLE Org (
    name VARCHAR(255) PRIMARY KEY,  -- Primary key as alphanumeric string
    account VARCHAR(255),
    website VARCHAR(255),
    fuel_reimbursement_policy varchar(255) DEFAULT "1000", -- Default fuel reimbursement policy
    speed_limit_policy varchar(255),
    parent_org VARCHAR(255),  -- Self-referencing foreign key to Org name
    child_orgs TEXT,  -- Comma-separated list of child org names
    FOREIGN KEY (parent_org) REFERENCES Org(name)  -- Foreign key constraint
);

-- Create the Vehicle table
CREATE TABLE Vehicle (
    vin CHAR(17) PRIMARY KEY,  -- 17 digit alphanumeric string as primary key
    orgId VARCHAR(255),  -- Foreign key referencing Org name
    Manufacturer varchar(255),
    Model varchar(255),
    Year varchar(255),
    FOREIGN KEY (orgId) REFERENCES Org(name)  -- Foreign key constraint
);

insert into Vehicle values("1HGCM82633A123456","ABC","AMERICAN HONDA MOTOR CO., INC.","Accord","2003");

insert into Org value("ABC", "wwwxyz","www.example.com","1000","30",NULL,"BCD,EFG");

insert into Org value("BCD", "wwwabc","www.example1.com","1000",NULL,"ABC","HIJ");

insert into Org values("EFG", "wwwabd","www.example2.com","1000",NULL,"ABC",NULL);

insert into Org values("HIJ", "wwwabd","www.example2.com","1000",NULL,"BCD",NULL);
