-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 13. 11:57
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `teendok`
--
CREATE DATABASE IF NOT EXISTS `teendok` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `teendok`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `teendok`
--

CREATE TABLE `teendok` (
  `id` int(11) NOT NULL,
  `cim` varchar(512) DEFAULT NULL,
  `prioritas` enum('magas','közepes','alacsony') DEFAULT NULL,
  `hatarido` varchar(512) DEFAULT NULL,
  `kesz` enum('true','false') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `teendok`
--

INSERT INTO `teendok` (`id`, `cim`, `prioritas`, `hatarido`, `kesz`) VALUES
(1, 'Matek házi: 45. oldal', 'magas', '2026-09-25', 'false'),
(2, 'Könyvtárba visszavinni a Tüskevárt', 'közepes', '2026-10-10', 'false'),
(3, 'Angol szavak tanulása', 'alacsony', '2026-09-20', 'true'),
(4, 'Webprogramozás beadandó', 'magas', '2026-10-20', 'false'),
(5, 'Tornacucc kimosása', 'alacsony', '2026-09-28', 'true');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `teendok`
--
ALTER TABLE `teendok`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `teendok`
--
ALTER TABLE `teendok`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
