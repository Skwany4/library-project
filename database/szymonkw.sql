-- phpMyAdmin SQL Dump
-- version 5.0.4deb2+deb11u1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Czas generowania: 01 Sty 2024, 21:35
-- Wersja serwera: 10.5.19-MariaDB-0+deb11u2
-- Wersja PHP: 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `szymonkw`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `books`
--

CREATE TABLE `books` (
  `Book_id` int(3) NOT NULL,
  `Title` varchar(50) DEFAULT NULL,
  `Author` varchar(100) DEFAULT NULL,
  `Available_Copies` int(3) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `books`
--

INSERT INTO `books` (`Book_id`, `Title`, `Author`, `Available_Copies`) VALUES
(1, 'Dziady część III', 'Adam Mickiewicz', 1),
(3, 'Chłopi', 'Władysław Reymont', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `loans`
--

CREATE TABLE `loans` (
  `Loan_id` int(3) NOT NULL,
  `User_id` int(3) DEFAULT NULL,
  `Book_id` int(3) DEFAULT NULL,
  `Loan_Date` date DEFAULT NULL,
  `Return_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `returns`
--

CREATE TABLE `returns` (
  `Return_id` int(3) NOT NULL,
  `Loan_id` int(3) DEFAULT NULL,
  `Return_Date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `User_id` int(3) NOT NULL,
  `First_Name` varchar(30) DEFAULT NULL,
  `Last_Name` varchar(30) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `Password` varchar(100) DEFAULT NULL,
  `Role` varchar(30) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`User_id`, `First_Name`, `Last_Name`, `Email`, `Password`, `Role`) VALUES
(1, 'Admin', 'admin', 'Admin@admin.com', 'password', 'admin'),
(2, 'User1', 'user', 'User@user.com', '1234', 'user'),
(3, 'Jan', 'Kowalski', 'Kowalski@gmail.com', '123', 'user');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`Book_id`);

--
-- Indeksy dla tabeli `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`Loan_id`),
  ADD KEY `User_id` (`User_id`),
  ADD KEY `Book_id` (`Book_id`);

--
-- Indeksy dla tabeli `returns`
--
ALTER TABLE `returns`
  ADD PRIMARY KEY (`Return_id`),
  ADD KEY `Loan_id` (`Loan_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`User_id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `books`
--
ALTER TABLE `books`
  MODIFY `Book_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT dla tabeli `returns`
--
ALTER TABLE `returns`
  MODIFY `Return_id` int(3) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `User_id` int(3) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Ograniczenia dla zrzutów tabel
--

--
-- Ograniczenia dla tabeli `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`User_id`) REFERENCES `users` (`User_id`),
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`Book_id`) REFERENCES `books` (`Book_id`);

--
-- Ograniczenia dla tabeli `returns`
--
ALTER TABLE `returns`
  ADD CONSTRAINT `returns_ibfk_1` FOREIGN KEY (`Loan_id`) REFERENCES `loans` (`Loan_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
