USE master;
GO

DROP DATABASE IF EXISTS raspored;
GO

CREATE DATABASE raspored;
GO

USE raspored;
GO

CREATE TABLE PROSTORIJA (
    sifra INT PRIMARY KEY IDENTITY(1,1),
    rednibroj INT,
    kat VARCHAR(50),
    brojslobodnihmjesta INT NOT NULL
);

CREATE TABLE RAZRED (
    sifra INT PRIMARY KEY IDENTITY(1,1),
    naziv VARCHAR(50),
    brojucenika INT
);

CREATE TABLE TERMIN (
    sifra INT PRIMARY KEY IDENTITY(1,1),
    razred_sifra INT,
    prostorija_sifra INT,
    vrijemepocetka DATETIME,
    FOREIGN KEY (razred_sifra) REFERENCES razred(sifra),
    FOREIGN KEY (prostorija_sifra) REFERENCES prostorija(sifra)
);

INSERT INTO PROSTORIJA(rednibroj, kat, brojslobodnihmjesta) 
VALUES 
(3, 'prvi', 27),
(1, 'drugi', 33),
(2, 'treci', 30);

INSERT INTO Razred(naziv, brojucenika) 
VALUES 
('7_c', 18),
('8_b', 24),
('1_a', 12);

INSERT INTO TERMIN(razred_sifra, prostorija_sifra, vrijemepocetka) 
VALUES 
(1, 1, '2024-10-11 08:00'),  
(2, 2, '2024-09-20 11:00'),  
(3, 3, '2024-11-27 14:00');  

SELECT * FROM PROSTORIJA;
SELECT * FROM RAZRED;
SELECT * FROM TERMIN;