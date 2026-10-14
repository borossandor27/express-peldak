-- =====================================================
-- 20. feladat MySQL-lel - Elektronikus jegynapló
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `jegynaplo` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `jegynaplo`;

DROP TABLE IF EXISTS `jegyek`;
DROP TABLE IF EXISTS `diakok`;

CREATE TABLE `diakok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `osztaly` varchar(5) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `jegyek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `diak_id` int(11) NOT NULL,
  `tantargy` varchar(50) NOT NULL,
  `jegy` tinyint(4) NOT NULL,
  -- 1 = normál, 2 = témazáró
  `suly` tinyint(4) NOT NULL DEFAULT 1,
  -- valódi dátum típus (a JSON-ban szöveg volt)
  `datum` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_jegyek_diak` (`diak_id`),
  -- a diák törlésekor a jegyei is törlődnek
  CONSTRAINT `fk_jegyek_diak` FOREIGN KEY (`diak_id`) REFERENCES `diakok` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_jegyek_jegy` CHECK (`jegy` BETWEEN 1 AND 5),
  CONSTRAINT `chk_jegyek_suly` CHECK (`suly` IN (1, 2))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `diakok` (`id`, `nev`, `osztaly`) VALUES
(1, 'Kiss Anna', '10.A'),
(2, 'Nagy Péter', '10.A'),
(3, 'Szabó Lili', '10.A'),
(4, 'Tóth Bence', '10.B');

INSERT INTO `jegyek` (`id`, `diak_id`, `tantargy`, `jegy`, `suly`, `datum`) VALUES
(1, 1, 'Matematika', 5, 1, '2026-09-10'),
(2, 1, 'Matematika', 4, 2, '2026-09-24'),
(3, 1, 'Informatika', 5, 1, '2026-09-15'),
(4, 1, 'Történelem', 4, 1, '2026-09-18'),
(5, 2, 'Matematika', 2, 1, '2026-09-10'),
(6, 2, 'Matematika', 3, 2, '2026-09-24'),
(7, 2, 'Informatika', 4, 1, '2026-09-15'),
(8, 2, 'Informatika', 5, 1, '2026-09-29'),
(9, 3, 'Matematika', 5, 2, '2026-09-24'),
(10, 3, 'Történelem', 5, 1, '2026-09-18'),
(11, 3, 'Informatika', 4, 1, '2026-09-15'),
(12, 4, 'Matematika', 1, 1, '2026-09-11'),
(13, 4, 'Matematika', 3, 2, '2026-09-25'),
(14, 4, 'Történelem', 3, 1, '2026-09-19');
