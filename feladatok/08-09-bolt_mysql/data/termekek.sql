-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Okt 13. 10:43
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
-- Adatbázis: `termekek`
--
CREATE DATABASE IF NOT EXISTS `termekek` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `termekek`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `termekek`
--

CREATE TABLE `termekek` (
  `id` int(11) NOT NULL,
  `nev` varchar(512) DEFAULT NULL,
  `kategoria` enum('papíráru','íróeszköz','táska','elektronika') DEFAULT NULL,
  `ar` int(11) DEFAULT NULL,
  `keszlet` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `termekek`
--

INSERT INTO `termekek` (`id`, `nev`, `kategoria`, `ar`, `keszlet`) VALUES
(1, 'Füzet A4 vonalas', 'papíráru', 390, 120),
(2, 'Golyóstoll kék', 'íróeszköz', 250, 300),
(3, 'Grafitceruza HB', 'íróeszköz', 150, 0),
(4, 'Radír', 'íróeszköz', 180, 75),
(5, 'Iskolatáska', 'táska', 12990, 8),
(6, 'Tolltartó', 'táska', 2490, 0),
(7, 'Számológép', 'elektronika', 5990, 15),
(8, 'Füzet A5 négyzetrácsos', 'papíráru', 290, 200);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `termekek`
--
ALTER TABLE `termekek`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `termekek`
--
ALTER TABLE `termekek`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
