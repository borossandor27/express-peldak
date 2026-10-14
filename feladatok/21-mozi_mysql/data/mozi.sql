-- =====================================================
-- 21. feladat MySQL-lel - Mozi jegyfoglalás
-- Importálás: phpMyAdmin -> Importálás -> ez a fájl
-- Újra importálva visszaáll az eredeti állapot.
-- =====================================================

CREATE DATABASE IF NOT EXISTS `mozi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_hungarian_ci;
USE `mozi`;

DROP TABLE IF EXISTS `foglalt_helyek`;
DROP TABLE IF EXISTS `foglalasok`;
DROP TABLE IF EXISTS `vetitesek`;
DROP TABLE IF EXISTS `termek`;
DROP TABLE IF EXISTS `filmek`;

CREATE TABLE `filmek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cim` varchar(100) NOT NULL,
  `hossz` int(11) NOT NULL,
  `korhatar` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- A terem mérete a teremhez tartozik, nem a vetítéshez (a JSON-ban minden vetítésnél ismétlődött)
CREATE TABLE `termek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nev` varchar(50) NOT NULL,
  `sorok` tinyint(3) UNSIGNED NOT NULL,
  `szekek` tinyint(3) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_termek_nev` (`nev`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `vetitesek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `film_id` int(11) NOT NULL,
  `terem_id` int(11) NOT NULL,
  `datum` date NOT NULL,
  `idopont` time NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_vetitesek_film` (`film_id`),
  KEY `fk_vetitesek_terem` (`terem_id`),
  CONSTRAINT `fk_vetitesek_film` FOREIGN KEY (`film_id`) REFERENCES `filmek` (`id`),
  CONSTRAINT `fk_vetitesek_terem` FOREIGN KEY (`terem_id`) REFERENCES `termek` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

CREATE TABLE `foglalasok` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `vetites_id` int(11) NOT NULL,
  `nev` varchar(100) NOT NULL,
  `ar` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  -- a foglalt_helyek összetett idegen kulcsához kell
  UNIQUE KEY `uq_foglalasok_id_vetites` (`id`, `vetites_id`),
  KEY `fk_foglalasok_vetites` (`vetites_id`),
  CONSTRAINT `fk_foglalasok_vetites` FOREIGN KEY (`vetites_id`) REFERENCES `vetitesek` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

-- Egy foglalás helyei (a JSON-ban beágyazott tömb volt).
-- A vetites_id itt is szerepel, hogy az egyedi kulcs megakadályozza a dupla foglalást:
-- ugyanarra a vetítésre ugyanaz a hely csak egyszer kerülhet be.
CREATE TABLE `foglalt_helyek` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `foglalas_id` int(11) NOT NULL,
  `vetites_id` int(11) NOT NULL,
  `sor` tinyint(3) UNSIGNED NOT NULL,
  `szek` tinyint(3) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_foglalt_helyek_hely` (`vetites_id`, `sor`, `szek`),
  KEY `fk_foglalt_helyek_foglalas` (`foglalas_id`, `vetites_id`),
  -- összetett idegen kulcs: a hely vetítése biztosan ugyanaz, mint a foglalásé;
  -- a foglalás törlésekor (lemondás) a helyei is törlődnek
  CONSTRAINT `fk_foglalt_helyek_foglalas` FOREIGN KEY (`foglalas_id`, `vetites_id`)
    REFERENCES `foglalasok` (`id`, `vetites_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

INSERT INTO `filmek` (`id`, `cim`, `hossz`, `korhatar`) VALUES
(1, 'Macskafogó', 96, 6),
(2, 'Eredet', 148, 12),
(3, 'Kontroll', 105, 16);

INSERT INTO `termek` (`id`, `nev`, `sorok`, `szekek`) VALUES
(1, 'Kis terem', 4, 6),
(2, 'Nagy terem', 6, 10);

INSERT INTO `vetitesek` (`id`, `film_id`, `terem_id`, `datum`, `idopont`) VALUES
(1, 1, 1, '2026-10-10', '15:00'),
(2, 2, 2, '2026-10-10', '18:00'),
(3, 3, 1, '2026-10-11', '20:30'),
(4, 1, 2, '2026-10-11', '10:00');

INSERT INTO `foglalasok` (`id`, `vetites_id`, `nev`, `ar`) VALUES
(1, 1, 'Kiss Anna', 5000),
(2, 1, 'Nagy Péter', 2500),
(3, 2, 'Szabó Lili', 7500);

INSERT INTO `foglalt_helyek` (`id`, `foglalas_id`, `vetites_id`, `sor`, `szek`) VALUES
(1, 1, 1, 2, 3),
(2, 1, 1, 2, 4),
(3, 2, 1, 4, 1),
(4, 3, 2, 5, 5),
(5, 3, 2, 5, 6),
(6, 3, 2, 5, 7);
