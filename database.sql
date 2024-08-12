/*!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.2-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: MotorQ
-- ------------------------------------------------------
-- Server version	11.4.2-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `Org`
--

DROP TABLE IF EXISTS `Org`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Org` (
  `name` varchar(255) NOT NULL,
  `account` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `fuel_reimbursement_policy` decimal(10,2) DEFAULT 1000.00,
  `speed_limit_policy` decimal(5,2) DEFAULT NULL,
  `parent_org` varchar(255) DEFAULT NULL,
  `child_orgs` text DEFAULT NULL,
  PRIMARY KEY (`name`),
  KEY `parent_org` (`parent_org`),
  CONSTRAINT `Org_ibfk_1` FOREIGN KEY (`parent_org`) REFERENCES `Org` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Org`
--

LOCK TABLES `Org` WRITE;
/*!40000 ALTER TABLE `Org` DISABLE KEYS */;
INSERT INTO `Org` VALUES
('ABC','wwwxyz','www.example.com',1000.00,30.00,NULL,'BCD,EFG'),
('BCD','wwwabc','www.example1.com',1000.00,NULL,'ABC','HIJ'),
('EFG','wwwabd','www.example2.com',1000.00,NULL,'ABC',NULL),
('HIJ','wwwabd','www.example2.com',1000.00,NULL,'BCD',NULL);
/*!40000 ALTER TABLE `Org` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Vehicle`
--

DROP TABLE IF EXISTS `Vehicle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Vehicle` (
  `vin` char(17) NOT NULL,
  `orgId` varchar(255) DEFAULT NULL,
  `Manufacturer` varchar(100) NOT NULL,
  `Model` varchar(100) DEFAULT NULL,
  `Year` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`vin`),
  KEY `orgId` (`orgId`),
  CONSTRAINT `Vehicle_ibfk_1` FOREIGN KEY (`orgId`) REFERENCES `Org` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Vehicle`
--

LOCK TABLES `Vehicle` WRITE;
/*!40000 ALTER TABLE `Vehicle` DISABLE KEYS */;
INSERT INTO `Vehicle` VALUES
('1C6RR7GT7ES359256','ABC','FCA US LLC','1500','2014'),
('1HGCM82633A123456','ABC','AMERICAN HONDA MOTOR CO., INC.','Accord','2003'),
('2G2WR544441298674','ABC','GENERAL MOTORS LLC','Grand Prix','2004'),
('3GNGC26J7VG129591','ABC','GENERAL MOTORS LLC','Suburban','1997');
/*!40000 ALTER TABLE `Vehicle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'MotorQ'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2024-08-12 18:32:19
