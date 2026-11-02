-- =====================================================
-- 39. feladat - Iskolai sportnap (4 tábla)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- Az adatok kitaláltak.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `sportnap` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `sportnap`;

DROP TABLE IF EXISTS `eredmenyek`;
DROP TABLE IF EXISTS `versenyszamok`;
DROP TABLE IF EXISTS `diakok`;
DROP TABLE IF EXISTS `osztalyok`;

CREATE TABLE `osztalyok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(10) NOT NULL,
  `ofo` varchar(100) NOT NULL COMMENT 'osztályfőnök',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_osztalyok_nev` (`nev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `diakok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `osztaly_id` int(11) NOT NULL,
  `nem` enum('fiú','lány') NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_diakok_osztaly` (`osztaly_id`),
  CONSTRAINT `fk_diakok_osztaly` FOREIGN KEY (`osztaly_id`) REFERENCES `osztalyok` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- jobb = 'kisebb': a kisebb eredmény a jobb (futás, másodperc)
-- jobb = 'nagyobb': a nagyobb eredmény a jobb (ugrás, dobás, méter)
CREATE TABLE `versenyszamok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  `mertekegyseg` enum('mp','m') NOT NULL,
  `jobb` enum('kisebb','nagyobb') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Egy diák egy versenyszámban csak egy eredményt kaphat (UNIQUE).
CREATE TABLE `eredmenyek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `diak_id` int(11) NOT NULL,
  `versenyszam_id` int(11) NOT NULL,
  `eredmeny` decimal(6,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_eredmenyek_diak_versenyszam` (`diak_id`, `versenyszam_id`),
  KEY `fk_eredmenyek_versenyszam` (`versenyszam_id`),
  CONSTRAINT `fk_eredmenyek_diak` FOREIGN KEY (`diak_id`) REFERENCES `diakok` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_eredmenyek_versenyszam` FOREIGN KEY (`versenyszam_id`) REFERENCES `versenyszamok` (`id`),
  CONSTRAINT `chk_eredmenyek_pozitiv` CHECK (`eredmeny` > 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `osztalyok` (`id`, `nev`, `ofo`) VALUES
(1, '9.A', 'Kiss Ágnes'),
(2, '10.B', 'Horváth Gábor'),
(3, '11.C', 'Varga Ildikó'),
(4, '12.A', 'Fekete László');

INSERT INTO `diakok` (`id`, `nev`, `osztaly_id`, `nem`) VALUES
(1, 'Balogh Ádám', 1, 'fiú'),
(2, 'Csonka Bella', 1, 'lány'),
(3, 'Deák Csaba', 1, 'fiú'),
(4, 'Erdős Dóra', 2, 'lány'),
(5, 'Fazekas Ede', 2, 'fiú'),
(6, 'Gál Fanni', 2, 'lány'),
(7, 'Hegedűs Gergő', 3, 'fiú'),
(8, 'Illés Hanna', 3, 'lány'),
(9, 'Juhász István', 3, 'fiú'),
(10, 'Katona Júlia', 3, 'lány'),
(11, 'Lengyel Kristóf', 4, 'fiú'),
(12, 'Major Luca', 4, 'lány');

INSERT INTO `versenyszamok` (`id`, `nev`, `mertekegyseg`, `jobb`) VALUES
(1, '100 m futás', 'mp', 'kisebb'),
(2, 'Távolugrás', 'm', 'nagyobb'),
(3, 'Kislabdahajítás', 'm', 'nagyobb'),
(4, '800 m futás', 'mp', 'kisebb');

INSERT INTO `eredmenyek` (`id`, `diak_id`, `versenyszam_id`, `eredmeny`) VALUES
(1, 1, 1, 13.42), (2, 3, 1, 12.98), (3, 5, 1, 13.10), (4, 7, 1, 12.75),
(5, 9, 1, 13.10), (6, 2, 1, 14.85), (7, 4, 1, 14.20), (8, 8, 1, 14.60),
(9, 1, 2, 4.85), (10, 3, 2, 5.12), (11, 5, 2, 4.60), (12, 7, 2, 5.40),
(13, 2, 2, 4.05), (14, 6, 2, 4.30), (15, 10, 2, 3.95),
(16, 3, 3, 52.30), (17, 5, 3, 58.75), (18, 9, 3, 61.20), (19, 4, 3, 38.40),
(20, 6, 3, 41.10), (21, 8, 3, 36.90),
(22, 7, 4, 148.50), (23, 9, 4, 151.20), (24, 1, 4, 155.80), (25, 2, 4, 172.40),
(26, 10, 4, 168.90);
