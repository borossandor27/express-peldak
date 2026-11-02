-- =====================================================
-- 38. feladat - Projektek és munkaórák (3 tábla, N:M kapcsolat plusz adatokkal)
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- Az adatok kitaláltak.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `projektek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `projektek`;

DROP TABLE IF EXISTS `munkaorak`;
DROP TABLE IF EXISTS `projektek`;
DROP TABLE IF EXISTS `dolgozok`;

CREATE TABLE `dolgozok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `munkakor` varchar(30) NOT NULL,
  `oradij` int(11) NOT NULL COMMENT 'Ft / óra',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `projektek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `ugyfel` varchar(100) NOT NULL,
  `hatarido` date NOT NULL,
  `keret` int(11) NOT NULL COMMENT 'Ft',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Ki, melyik projekten, melyik napon hány órát dolgozott.
-- A dolgozók és a projektek között N:M kapcsolat van, és a kapcsolatnak saját adatai is vannak.
CREATE TABLE `munkaorak` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dolgozo_id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `ora` decimal(3,1) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_munkaorak_dolgozo` (`dolgozo_id`),
  KEY `fk_munkaorak_projekt` (`projekt_id`),
  CONSTRAINT `fk_munkaorak_dolgozo` FOREIGN KEY (`dolgozo_id`) REFERENCES `dolgozok` (`id`),
  CONSTRAINT `fk_munkaorak_projekt` FOREIGN KEY (`projekt_id`) REFERENCES `projektek` (`id`),
  CONSTRAINT `chk_munkaorak_ora` CHECK (`ora` > 0 AND `ora` <= 12)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `dolgozok` (`id`, `nev`, `munkakor`, `oradij`) VALUES
(1, 'Bíró Anna', 'fejlesztő', 9000),
(2, 'Csizmadia Bálint', 'fejlesztő', 8000),
(3, 'Dobos Cecília', 'tervező', 7500),
(4, 'Erdei Dániel', 'tesztelő', 6000),
(5, 'Fábián Emese', 'projektvezető', 10000),
(6, 'Gulyás Ferenc', 'fejlesztő', 8500);

INSERT INTO `projektek` (`id`, `nev`, `ugyfel`, `hatarido`, `keret`) VALUES
(1, 'Webáruház', 'Kerekes Kft.', '2026-11-30', 600000),
(2, 'Foglalási rendszer', 'Napfény Hotel', '2026-12-15', 400000),
(3, 'Iskolai honlap', 'Petőfi Gimnázium', '2026-10-31', 150000),
(4, 'Mobilalkalmazás', 'Kerekes Kft.', '2027-03-31', 900000);

INSERT INTO `munkaorak` (`id`, `dolgozo_id`, `projekt_id`, `datum`, `ora`) VALUES
(1, 1, 1, '2026-10-05', 6.0),
(2, 1, 1, '2026-10-06', 8.0),
(3, 1, 2, '2026-10-07', 4.0),
(4, 2, 1, '2026-10-05', 7.5),
(5, 2, 1, '2026-10-06', 6.0),
(6, 2, 3, '2026-10-07', 8.0),
(7, 3, 1, '2026-10-05', 4.0),
(8, 3, 3, '2026-10-06', 6.5),
(9, 3, 3, '2026-10-08', 5.0),
(10, 4, 1, '2026-10-08', 5.0),
(11, 4, 2, '2026-10-09', 3.5),
(12, 5, 1, '2026-10-05', 2.0),
(13, 5, 2, '2026-10-05', 2.0),
(14, 5, 3, '2026-10-06', 1.5),
(15, 1, 2, '2026-10-08', 7.0),
(16, 2, 3, '2026-10-09', 4.0),
(17, 4, 3, '2026-10-09', 3.0);
