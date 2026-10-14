-- =====================================================
-- 18. feladat MySQL-lel - Iskolai focibajnokság
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `bajnoksag` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `bajnoksag`;

DROP TABLE IF EXISTS `meccsek`;
DROP TABLE IF EXISTS `csapatok`;

CREATE TABLE `csapatok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_csapatok_nev` (`nev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `meccsek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fordulo` tinyint(3) UNSIGNED NOT NULL,
  `hazai_id` int(11) NOT NULL,
  `vendeg_id` int(11) NOT NULL,
  `hazai_gol` tinyint(3) UNSIGNED NOT NULL,
  `vendeg_gol` tinyint(3) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_meccsek_hazai` (`hazai_id`),
  KEY `fk_meccsek_vendeg` (`vendeg_id`),
  CONSTRAINT `fk_meccsek_hazai` FOREIGN KEY (`hazai_id`) REFERENCES `csapatok` (`id`),
  CONSTRAINT `fk_meccsek_vendeg` FOREIGN KEY (`vendeg_id`) REFERENCES `csapatok` (`id`),
  -- egy csapat nem játszhat saját maga ellen
  CONSTRAINT `chk_meccsek_ket_csapat` CHECK (`hazai_id` <> `vendeg_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `csapatok` (`id`, `nev`) VALUES
(1, '9.A'),
(2, '10.A'),
(3, '11.A'),
(4, '12.A');

INSERT INTO `meccsek` (`id`, `fordulo`, `hazai_id`, `vendeg_id`, `hazai_gol`, `vendeg_gol`) VALUES
(1, 1, 1, 2, 1, 3),
(2, 1, 3, 4, 2, 2),
(3, 2, 2, 3, 4, 1),
(4, 2, 4, 1, 0, 1),
(5, 3, 1, 3, 2, 2),
(6, 3, 2, 4, 1, 2),
(7, 4, 2, 1, 2, 0),
(8, 4, 4, 3, 3, 1),
(9, 5, 3, 2, 0, 0),
(10, 5, 1, 4, 2, 3),
(11, 6, 3, 1, 1, 4),
(12, 6, 4, 2, 1, 1);
