-- =====================================================
-- 19. feladat MySQL-lel - Receptkönyv
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `receptek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `receptek`;

DROP TABLE IF EXISTS `hozzavalok`;
DROP TABLE IF EXISTS `receptek`;

CREATE TABLE `receptek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(100) NOT NULL,
  `kategoria` varchar(50) NOT NULL,
  `adag` int(11) NOT NULL,
  `ido_perc` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Egy recept hozzávalói: 1 recept - N hozzávaló (a JSON-ban beágyazott tömb volt)
CREATE TABLE `hozzavalok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `recept_id` int(11) NOT NULL,
  `nev` varchar(50) NOT NULL,
  `mennyiseg` decimal(8,2) NOT NULL,
  `egyseg` varchar(20) NOT NULL,
  PRIMARY KEY (`id`),
  -- egy receptben egy hozzávaló csak egyszer szerepelhet
  UNIQUE KEY `uq_hozzavalok_recept_nev` (`recept_id`, `nev`),
  -- a recept törlésekor a hozzávalói is törlődnek
  CONSTRAINT `fk_hozzavalok_recept` FOREIGN KEY (`recept_id`) REFERENCES `receptek` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `receptek` (`id`, `nev`, `kategoria`, `adag`, `ido_perc`) VALUES
(1, 'Palacsinta', 'desszert', 4, 30),
(2, 'Gulyásleves', 'leves', 6, 120),
(3, 'Rántotta', 'reggeli', 2, 10),
(4, 'Bundás kenyér', 'reggeli', 2, 15),
(5, 'Piskóta', 'desszert', 8, 45);

INSERT INTO `hozzavalok` (`id`, `recept_id`, `nev`, `mennyiseg`, `egyseg`) VALUES
(1, 1, 'liszt', 200, 'g'),
(2, 1, 'tej', 5, 'dl'),
(3, 1, 'tojás', 2, 'db'),
(4, 1, 'cukor', 1, 'ek'),
(5, 1, 'só', 1, 'csipet'),
(6, 2, 'marhahús', 600, 'g'),
(7, 2, 'burgonya', 500, 'g'),
(8, 2, 'vöröshagyma', 2, 'db'),
(9, 2, 'sárgarépa', 2, 'db'),
(10, 2, 'pirospaprika', 2, 'ek'),
(11, 2, 'só', 1, 'tk'),
(12, 3, 'tojás', 4, 'db'),
(13, 3, 'vaj', 20, 'g'),
(14, 3, 'só', 1, 'csipet'),
(15, 4, 'kenyér', 4, 'szelet'),
(16, 4, 'tojás', 2, 'db'),
(17, 4, 'tej', 1, 'dl'),
(18, 4, 'olaj', 3, 'ek'),
(19, 4, 'só', 1, 'csipet'),
(20, 5, 'tojás', 6, 'db'),
(21, 5, 'cukor', 120, 'g'),
(22, 5, 'liszt', 120, 'g');
