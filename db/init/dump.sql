-- MySQL dump 10.13  Distrib 9.4.0, for macos15 (arm64)
--
-- Host: localhost    Database: smart_studenthub
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comment`
--

DROP TABLE IF EXISTS `comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comment` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `task_id` bigint NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfknte4fhjhet3l1802m1yqa50` (`task_id`),
  KEY `FK8kcum44fvpupyw6f5baccx25c` (`user_id`),
  CONSTRAINT `FK8kcum44fvpupyw6f5baccx25c` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FKfknte4fhjhet3l1802m1yqa50` FOREIGN KEY (`task_id`) REFERENCES `task` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment`
--

LOCK TABLES `comment` WRITE;
/*!40000 ALTER TABLE `comment` DISABLE KEYS */;
INSERT INTO `comment` VALUES (14,'jsjsj','2025-10-18 19:45:21.485000',15,8),(15,'disks','2025-10-18 19:45:24.449000',15,8),(16,'jjj','2025-10-25 23:51:55.134000',22,8),(17,'jjfjffj','2025-11-05 17:24:02.685000',29,8),(18,'jee','2025-11-05 17:24:06.683000',29,8),(19,'I passed 9','2025-11-05 17:24:14.115000',29,8);
/*!40000 ALTER TABLE `comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `expense`
--

DROP TABLE IF EXISTS `expense`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expense` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` double DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `date` datetime(6) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK758h5dgdblrpwoaaycbmn29i0` (`user_id`),
  CONSTRAINT `FK758h5dgdblrpwoaaycbmn29i0` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=263 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `expense`
--

LOCK TABLES `expense` WRITE;
/*!40000 ALTER TABLE `expense` DISABLE KEYS */;
INSERT INTO `expense` VALUES (1,25.5,'Food','2025-01-01 00:00:00.000000','Groceries',1),(2,25.5,'Food','2025-01-03 00:00:00.000000','Groceries',1),(3,25.5,'Food','2025-01-04 00:00:00.000000','Groceries',1),(4,25.5,'Food','2025-01-01 00:00:00.000000','Groceries',1),(5,25.5,'Food','2025-01-03 00:00:00.000000','Groceries',1),(6,25.5,'Food','2025-01-04 00:00:00.000000','Groceries',1),(7,149.73,'Travel','2025-08-02 00:00:00.000000','Souvenir',8),(9,205.54,'Travel','2025-06-15 00:00:00.000000','Flight',8),(10,312.37,'Education','2025-01-31 00:00:00.000000','Course',8),(11,479.76,'Utilities','2025-03-22 00:00:00.000000','Electricity bill',8),(12,185.79,'Shopping','2025-05-05 00:00:00.000000','Clothes',8),(13,181.21,'Transport','2025-08-29 00:00:00.000000','Train ticket',8),(15,228.44,'Transport','2025-02-10 00:00:00.000000','Taxi',8),(17,185.68,'Transport','2025-09-30 00:00:00.000000','Taxi',8),(18,480.72,'Entertainment','2025-05-17 00:00:00.000000','Movie',8),(19,257.23,'Entertainment','2025-01-15 00:00:00.000000','Movie',8),(20,256.48,'Food','2025-07-31 00:00:00.000000','Coffee',8),(21,200.95,'Utilities','2025-08-12 00:00:00.000000','Water bill',8),(23,204.62,'Transport','2025-05-17 00:00:00.000000','Gas',8),(24,212.78,'Transport','2025-07-02 00:00:00.000000','Taxi',8),(25,392.67,'Transport','2025-09-08 00:00:00.000000','Bus ticket',8),(27,314.61,'Health','2025-05-25 00:00:00.000000','Pharmacy',8),(28,109,'Travel','2025-06-23 00:00:00.000000','Flight',8),(29,304.23,'Utilities','2025-06-20 00:00:00.000000','Water bill',8),(30,134.17,'Food','2025-09-22 00:00:00.000000','Groceries',8),(31,9.03,'Shopping','2025-08-10 00:00:00.000000','Home decor',8),(32,209.51,'Utilities','2025-08-14 00:00:00.000000','Water bill',8),(34,206.13,'Food','2025-08-21 00:00:00.000000','Coffee',8),(35,236.84,'Food','2025-07-04 00:00:00.000000','Coffee',8),(37,59.51,'Travel','2025-04-22 00:00:00.000000','Museum',8),(38,35.84,'Utilities','2025-08-24 00:00:00.000000','Water bill',8),(39,438.87,'Travel','2025-03-19 00:00:00.000000','Souvenir',8),(40,310.79,'Education','2025-05-21 00:00:00.000000','Course',8),(41,391.67,'Food','2025-08-21 00:00:00.000000','Snacks',8),(42,289.3,'Food','2025-04-03 00:00:00.000000','Snacks',8),(43,327.93,'Food','2025-07-12 00:00:00.000000','Restaurant',8),(45,134.97,'Shopping','2025-06-25 00:00:00.000000','Shoes',8),(46,7.74,'Food','2025-02-15 00:00:00.000000','Groceries',8),(47,28.97,'Health','2025-06-01 00:00:00.000000','Doctor visit',8),(48,11.87,'Education','2025-09-02 00:00:00.000000','Online subscription',8),(49,433.98,'Education','2025-08-11 00:00:00.000000','Books',8),(50,206.45,'Food','2025-08-21 00:00:00.000000','Restaurant',8),(51,212.37,'Transport','2025-06-26 00:00:00.000000','Bus ticket',8),(52,94.97,'Utilities','2025-08-04 00:00:00.000000','Electricity bill',8),(53,26.49,'Health','2025-05-16 00:00:00.000000','Pharmacy',8),(54,230.43,'Health','2025-08-19 00:00:00.000000','Gym membership',8),(55,300.57,'Entertainment','2025-07-25 00:00:00.000000','Streaming service',8),(56,478.6,'Shopping','2025-05-02 00:00:00.000000','Shoes',8),(111,141.14,'Entertainment','2025-03-11 00:00:00.000000','Streaming service',8),(112,386.7,'Health','2025-01-06 00:00:00.000000','Doctor visit',8),(113,149.73,'Travel','2025-08-02 00:00:00.000000','Souvenir',2),(115,205.54,'Travel','2025-06-15 00:00:00.000000','Flight',2),(116,312.37,'Education','2025-01-31 00:00:00.000000','Course',2),(117,479.76,'Utilities','2025-03-22 00:00:00.000000','Electricity bill',2),(118,185.79,'Shopping','2025-05-05 00:00:00.000000','Clothes',2),(119,181.21,'Transport','2025-08-29 00:00:00.000000','Train ticket',2),(120,196.14,'Health','2025-10-13 00:00:00.000000','Doctor visit',2),(121,228.44,'Transport','2025-02-10 00:00:00.000000','Taxi',2),(122,92.97,'Shopping','2025-10-12 00:00:00.000000','Shoes',2),(123,185.68,'Transport','2025-09-30 00:00:00.000000','Taxi',2),(124,480.72,'Entertainment','2025-05-17 00:00:00.000000','Movie',2),(125,257.23,'Entertainment','2025-01-15 00:00:00.000000','Movie',2),(126,256.48,'Food','2025-07-31 00:00:00.000000','Coffee',2),(127,200.95,'Utilities','2025-08-12 00:00:00.000000','Water bill',2),(128,364.74,'Food','2025-10-22 00:00:00.000000','Snacks',2),(129,204.62,'Transport','2025-05-17 00:00:00.000000','Gas',2),(130,212.78,'Transport','2025-07-02 00:00:00.000000','Taxi',2),(131,392.67,'Transport','2025-09-08 00:00:00.000000','Bus ticket',2),(132,377.87,'Education','2025-10-19 00:00:00.000000','Course',2),(133,314.61,'Health','2025-05-25 00:00:00.000000','Pharmacy',2),(134,109,'Travel','2025-06-23 00:00:00.000000','Flight',2),(135,304.23,'Utilities','2025-06-20 00:00:00.000000','Water bill',2),(136,134.17,'Food','2025-09-22 00:00:00.000000','Groceries',2),(137,9.03,'Shopping','2025-08-10 00:00:00.000000','Home decor',2),(138,209.51,'Utilities','2025-08-14 00:00:00.000000','Water bill',2),(139,203.09,'Transport','2025-04-15 00:00:00.000000','Bus ticket',2),(140,206.13,'Food','2025-08-21 00:00:00.000000','Coffee',2),(141,236.84,'Food','2025-07-04 00:00:00.000000','Coffee',2),(142,386.7,'Health','2025-01-06 00:00:00.000000','Doctor visit',2),(143,59.51,'Travel','2025-04-22 00:00:00.000000','Museum',2),(144,35.84,'Utilities','2025-08-24 00:00:00.000000','Water bill',2),(145,438.87,'Travel','2025-03-19 00:00:00.000000','Souvenir',2),(146,310.79,'Education','2025-05-21 00:00:00.000000','Course',2),(147,391.67,'Food','2025-08-21 00:00:00.000000','Snacks',2),(148,289.3,'Food','2025-04-03 00:00:00.000000','Snacks',2),(149,327.93,'Food','2025-07-12 00:00:00.000000','Restaurant',2),(150,141.14,'Entertainment','2025-03-11 00:00:00.000000','Streaming service',2),(151,134.97,'Shopping','2025-06-25 00:00:00.000000','Shoes',2),(152,7.74,'Food','2025-02-15 00:00:00.000000','Groceries',2),(153,28.97,'Health','2025-06-01 00:00:00.000000','Doctor visit',2),(154,11.87,'Education','2025-09-02 00:00:00.000000','Online subscription',2),(155,433.98,'Education','2025-08-11 00:00:00.000000','Books',2),(156,206.45,'Food','2025-08-21 00:00:00.000000','Restaurant',2),(157,212.37,'Transport','2025-06-26 00:00:00.000000','Bus ticket',2),(158,94.97,'Utilities','2025-08-04 00:00:00.000000','Electricity bill',2),(159,26.49,'Health','2025-05-16 00:00:00.000000','Pharmacy',2),(160,230.43,'Health','2025-08-19 00:00:00.000000','Gym membership',2),(161,300.57,'Entertainment','2025-07-25 00:00:00.000000','Streaming service',2),(162,478.6,'Shopping','2025-05-02 00:00:00.000000','Shoes',2),(163,149.73,'Travel','2025-08-02 00:00:00.000000','Souvenir',1),(164,296.88,'Food','2025-10-24 00:00:00.000000','Groceries',1),(165,205.54,'Travel','2025-06-15 00:00:00.000000','Flight',1),(166,312.37,'Education','2025-01-31 00:00:00.000000','Course',1),(167,479.76,'Utilities','2025-03-22 00:00:00.000000','Electricity bill',1),(168,185.79,'Shopping','2025-05-05 00:00:00.000000','Clothes',1),(169,181.21,'Transport','2025-08-29 00:00:00.000000','Train ticket',1),(170,196.14,'Health','2025-10-13 00:00:00.000000','Doctor visit',1),(171,228.44,'Transport','2025-02-10 00:00:00.000000','Taxi',1),(172,92.97,'Shopping','2025-10-12 00:00:00.000000','Shoes',1),(173,185.68,'Transport','2025-09-30 00:00:00.000000','Taxi',1),(174,480.72,'Entertainment','2025-05-17 00:00:00.000000','Movie',1),(175,257.23,'Entertainment','2025-01-15 00:00:00.000000','Movie',1),(176,256.48,'Food','2025-07-31 00:00:00.000000','Coffee',1),(177,200.95,'Utilities','2025-08-12 00:00:00.000000','Water bill',1),(178,364.74,'Food','2025-10-22 00:00:00.000000','Snacks',1),(179,204.62,'Transport','2025-05-17 00:00:00.000000','Gas',1),(180,212.78,'Transport','2025-07-02 00:00:00.000000','Taxi',1),(181,392.67,'Transport','2025-09-08 00:00:00.000000','Bus ticket',1),(182,377.87,'Education','2025-10-19 00:00:00.000000','Course',1),(183,314.61,'Health','2025-05-25 00:00:00.000000','Pharmacy',1),(184,109,'Travel','2025-06-23 00:00:00.000000','Flight',1),(185,304.23,'Utilities','2025-06-20 00:00:00.000000','Water bill',1),(186,134.17,'Food','2025-09-22 00:00:00.000000','Groceries',1),(187,9.03,'Shopping','2025-08-10 00:00:00.000000','Home decor',1),(188,209.51,'Utilities','2025-08-14 00:00:00.000000','Water bill',1),(189,203.09,'Transport','2025-04-15 00:00:00.000000','Bus ticket',1),(190,206.13,'Food','2025-08-21 00:00:00.000000','Coffee',1),(191,236.84,'Food','2025-07-04 00:00:00.000000','Coffee',1),(192,386.7,'Health','2025-01-06 00:00:00.000000','Doctor visit',1),(193,59.51,'Travel','2025-04-22 00:00:00.000000','Museum',1),(194,35.84,'Utilities','2025-08-24 00:00:00.000000','Water bill',1),(195,438.87,'Travel','2025-03-19 00:00:00.000000','Souvenir',1),(196,310.79,'Education','2025-05-21 00:00:00.000000','Course',1),(197,391.67,'Food','2025-08-21 00:00:00.000000','Snacks',1),(198,289.3,'Food','2025-04-03 00:00:00.000000','Snacks',1),(199,327.93,'Food','2025-07-12 00:00:00.000000','Restaurant',1),(200,141.14,'Entertainment','2025-03-11 00:00:00.000000','Streaming service',1),(201,134.97,'Shopping','2025-06-25 00:00:00.000000','Shoes',1),(202,7.74,'Food','2025-02-15 00:00:00.000000','Groceries',1),(203,28.97,'Health','2025-06-01 00:00:00.000000','Doctor visit',1),(204,11.87,'Education','2025-09-02 00:00:00.000000','Online subscription',1),(205,433.98,'Education','2025-08-11 00:00:00.000000','Books',1),(206,206.45,'Food','2025-08-21 00:00:00.000000','Restaurant',1),(207,212.37,'Transport','2025-06-26 00:00:00.000000','Bus ticket',1),(208,94.97,'Utilities','2025-08-04 00:00:00.000000','Electricity bill',1),(209,26.49,'Health','2025-05-16 00:00:00.000000','Pharmacy',1),(210,230.43,'Health','2025-08-19 00:00:00.000000','Gym membership',1),(211,300.57,'Entertainment','2025-07-25 00:00:00.000000','Streaming service',1),(212,478.6,'Shopping','2025-05-02 00:00:00.000000','Shoes',1),(213,149.73,'Travel','2025-08-02 00:00:00.000000','Souvenir',10),(214,296.88,'Food','2025-10-24 00:00:00.000000','Groceries',10),(215,205.54,'Travel','2025-06-15 00:00:00.000000','Flight',10),(216,312.37,'Education','2025-01-31 00:00:00.000000','Course',10),(217,479.76,'Utilities','2025-03-22 00:00:00.000000','Electricity bill',10),(218,185.79,'Shopping','2025-05-05 00:00:00.000000','Clothes',10),(219,181.21,'Transport','2025-08-29 00:00:00.000000','Train ticket',10),(220,196.14,'Health','2025-10-13 00:00:00.000000','Doctor visit',10),(221,228.44,'Transport','2025-02-10 00:00:00.000000','Taxi',10),(222,92.97,'Shopping','2025-10-12 00:00:00.000000','Shoes',10),(223,185.68,'Transport','2025-09-30 00:00:00.000000','Taxi',10),(224,480.72,'Entertainment','2025-05-17 00:00:00.000000','Movie',10),(225,257.23,'Entertainment','2025-01-15 00:00:00.000000','Movie',10),(226,256.48,'Food','2025-07-31 00:00:00.000000','Coffee',10),(227,200.95,'Utilities','2025-08-12 00:00:00.000000','Water bill',10),(228,364.74,'Food','2025-10-22 00:00:00.000000','Snacks',10),(229,204.62,'Transport','2025-05-17 00:00:00.000000','Gas',10),(230,212.78,'Transport','2025-07-02 00:00:00.000000','Taxi',10),(231,392.67,'Transport','2025-09-08 00:00:00.000000','Bus ticket',10),(232,377.87,'Education','2025-10-19 00:00:00.000000','Course',10),(233,314.61,'Health','2025-05-25 00:00:00.000000','Pharmacy',10),(234,109,'Travel','2025-06-23 00:00:00.000000','Flight',10),(235,304.23,'Utilities','2025-06-20 00:00:00.000000','Water bill',10),(236,134.17,'Food','2025-09-22 00:00:00.000000','Groceries',10),(237,9.03,'Shopping','2025-08-10 00:00:00.000000','Home decor',10),(238,209.51,'Utilities','2025-08-14 00:00:00.000000','Water bill',10),(239,203.09,'Transport','2025-04-15 00:00:00.000000','Bus ticket',10),(240,206.13,'Food','2025-08-21 00:00:00.000000','Coffee',10),(241,236.84,'Food','2025-07-04 00:00:00.000000','Coffee',10),(242,386.7,'Health','2025-01-06 00:00:00.000000','Doctor visit',10),(243,59.51,'Travel','2025-04-22 00:00:00.000000','Museum',10),(244,35.84,'Utilities','2025-08-24 00:00:00.000000','Water bill',10),(245,438.87,'Travel','2025-03-19 00:00:00.000000','Souvenir',10),(246,310.79,'Education','2025-05-21 00:00:00.000000','Course',10),(247,391.67,'Food','2025-08-21 00:00:00.000000','Snacks',10),(248,289.3,'Food','2025-04-03 00:00:00.000000','Snacks',10),(249,327.93,'Food','2025-07-12 00:00:00.000000','Restaurant',10),(250,141.14,'Entertainment','2025-03-11 00:00:00.000000','Streaming service',10),(251,134.97,'Shopping','2025-06-25 00:00:00.000000','Shoes',10),(252,7.74,'Food','2025-02-15 00:00:00.000000','Groceries',10),(253,28.97,'Health','2025-06-01 00:00:00.000000','Doctor visit',10),(254,11.87,'Education','2025-09-02 00:00:00.000000','Online subscription',10),(255,433.98,'Education','2025-08-11 00:00:00.000000','Books',10),(256,206.45,'Food','2025-08-21 00:00:00.000000','Restaurant',10),(257,212.37,'Transport','2025-06-26 00:00:00.000000','Bus ticket',10),(258,94.97,'Utilities','2025-08-04 00:00:00.000000','Electricity bill',10),(259,26.49,'Health','2025-05-16 00:00:00.000000','Pharmacy',10),(260,230.43,'Health','2025-08-19 00:00:00.000000','Gym membership',10),(261,300.57,'Entertainment','2025-07-25 00:00:00.000000','Streaming service',10),(262,478.6,'Shopping','2025-05-02 00:00:00.000000','Shoes',10);
/*!40000 ALTER TABLE `expense` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file_entity`
--

DROP TABLE IF EXISTS `file_entity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `file_entity` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_name` varchar(255) DEFAULT NULL,
  `file_type` varchar(255) DEFAULT NULL,
  `size` bigint DEFAULT NULL,
  `folder_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKoo9lmurb306wxgm9162pd2eec` (`folder_id`),
  CONSTRAINT `FKoo9lmurb306wxgm9162pd2eec` FOREIGN KEY (`folder_id`) REFERENCES `folder` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file_entity`
--

LOCK TABLES `file_entity` WRITE;
/*!40000 ALTER TABLE `file_entity` DISABLE KEYS */;
INSERT INTO `file_entity` VALUES (2,'expenses.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',9044,2),(3,'expenses.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',9044,2),(5,'focus.mp3','audio/mpeg',699663,3),(12,'A_big__scared_fox_and_a_big__scared_turtle_facing_each_other_in_a_forest_clearing____Fox__fluffy_tai.png','image/png',1717912,1),(13,'cat.jpg','image/jpeg',5564,18),(14,'cat.jpg','image/jpeg',5564,1);
/*!40000 ALTER TABLE `file_entity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `folder`
--

DROP TABLE IF EXISTS `folder`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `folder` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_public` bit(1) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `folder`
--

LOCK TABLES `folder` WRITE;
/*!40000 ALTER TABLE `folder` DISABLE KEYS */;
INSERT INTO `folder` VALUES (1,_binary '','MyFolder',1),(2,_binary '','MynewFolder',8),(3,_binary '\0','Private folder',8),(4,_binary '','Public folder',8),(18,_binary '','Analytical geometry 2025',10);
/*!40000 ALTER TABLE `folder` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `task`
--

DROP TABLE IF EXISTS `task`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `task` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `due_date` datetime(6) DEFAULT NULL,
  `priority` varchar(255) DEFAULT NULL,
  `task_status` tinyint DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `technique` enum('DEEP_WORK','EISENHOWER','NONE','POMODORO','TIME_BLOCKING') DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2hsytmxysatfvt0p1992cw449` (`user_id`),
  CONSTRAINT `FK2hsytmxysatfvt0p1992cw449` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `task_chk_1` CHECK ((`task_status` between 0 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=52 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `task`
--

LOCK TABLES `task` WRITE;
/*!40000 ALTER TABLE `task` DISABLE KEYS */;
INSERT INTO `task` VALUES (9,'Make the UI better!!!!!','2024-05-22 03:00:00.000000','MEDIUM',2,'UI fixes and bugs better',2,NULL),(15,'Fix reliability issues in support secure app','2025-10-27 02:00:00.000000','HIGH',1,'Support secure app',8,'TIME_BLOCKING'),(22,'SYD reliability fixes','2025-10-29 02:00:00.000000','HIGH',0,'SYD',8,'EISENHOWER'),(29,'Pass math exam at least for 8','2025-11-05 02:00:00.000000','HIGH',2,'Pass math exam',8,NULL),(34,'Finish successfully qualification project and show it in university before commission deputy.','2026-01-15 02:00:00.000000','HIGH',1,'Hand over QA',10,'EISENHOWER'),(35,'Prepare for an exam one week before, prepare formulas and theorems. Pass my math exam at least 8 out of 10.','2026-01-15 02:00:00.000000','MINOR',2,'Pass math exam',10,'EISENHOWER'),(36,'Pass the main cybersecurity courses in \"hack me if you can\" and get the certification of cybersecurity learning.','2026-03-12 02:00:00.000000','HIGH',1,'Get a cybersecurity certificate',10,'DEEP_WORK'),(37,'Finish me book that I started reading 2 months ago. 200 page are left, it should take no more than 2 weeks','2026-01-01 02:00:00.000000','LOW',1,'Finish a book',10,'EISENHOWER'),(49,'Pass math exam','2026-01-16 02:00:00.000000','MEDIUM',4,'Pass math exam',10,'EISENHOWER');
/*!40000 ALTER TABLE `task` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `technique`
--

DROP TABLE IF EXISTS `technique`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `technique` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `description` varchar(2000) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `steps` varchar(8000) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `technique`
--

LOCK TABLES `technique` WRITE;
/*!40000 ALTER TABLE `technique` DISABLE KEYS */;
INSERT INTO `technique` VALUES (1,'Work in focused 25-minute sessions followed by short breaks. Great for maintaining concentration.','POMODORO','1. Choose a task.\n2. Set a timer for 25 minutes.\n3. Work until the timer rings.\n4. Take a 5-minute break.\n5. Every 4 Pomodoros, take a longer 15–30 minute break.'),(2,'Prioritize tasks by urgency and importance using a 2x2 matrix.','EISENHOWER','1. Important + Urgent → Do immediately.\n2. Important + Not urgent → Schedule.\n3. Not important + Urgent → Delegate.\n4. Not important + Not urgent → Eliminate.'),(3,'Allocate specific blocks of time in your calendar for each task or activity.','TIME_BLOCKING','1. Plan your day or week.\n2. Assign blocks for focused work, meetings, and rest.\n3. Stick to the schedule strictly.'),(4,'Focus deeply on one demanding task without distractions for an extended period (60–90 mins).','DEEP_WORK','1. Eliminate distractions.\n2. Set clear goals.\n3. Enter a focused flow state.\n4. Reflect on results after session.');
/*!40000 ALTER TABLE `technique` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `user_role` tinyint DEFAULT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `user_chk_1` CHECK ((`user_role` between 0 and 1))
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'admin@test.com','admin','$2a$10$3Ie.WRdQsVaNtVXSU3icEu30xXIz44pW6EsZcKdDVVEbOJVArLnTK',0),(2,'himik@gmail.com','Himik','$2a$10$Jfe70EJxIAqWs7JYU.qdr.u93fAC.57EJLP6eCkFeQ5jznK/IpyRG',1),(3,'himiks@gmail.com','Himik','$2a$10$vNwR6H4tQdXOCh3VSavO4uhktUfdpcQkX9HOP.WEMCpkfV00eYXCe',1),(4,'himikss@gmail.com','Himik','$2a$10$LrOR3IQSo51Dfddnbo7KQ.YBmqHLHN1cPiuzS00P0Q59oX40PIsJ6',1),(7,'himikssssss@gmail.com','himik','$2a$10$oiA2Appevt/MOswuvn4iZO5jUFdtInHRVInIxdITGI8KeAWbZOpIS',1),(8,'user@gmail.com','user','$2a$10$X7UeWUffSXDB/Ut5bbFCfeTz5Vhxhq8d5OUDFpIusfkQwnVDH/Hiq',1),(9,'123@gmail.com','himik','$2a$10$42nUST4.GDEri9aYI9ns1.e9zm29WxvhpKey2WrIYFHlW4NexW092',1),(10,'atis@test.com','atiss','$2a$10$2WW8mVjnHscEW.hCJquFrO4GVQvi8Yi1wttIszgMMXoCrJ1jnbr8O',1);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-01-31 19:04:03
