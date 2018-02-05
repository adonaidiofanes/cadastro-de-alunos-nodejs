/*
SQLyog Ultimate v10.00 Beta1
MySQL - 5.7.14 : Database - projetinho
*********************************************************************
*/


/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`projetinho` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `projetinho`;

/*Table structure for table `alunos` */

DROP TABLE IF EXISTS `alunos`;

CREATE TABLE `alunos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nome` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=65 DEFAULT CHARSET=latin1;

/*Data for the table `alunos` */

insert  into `alunos`(`id`,`nome`,`email`) values (1,'Adonai Diofanes','lm@b.com'),(2,'Maria Oliveira','a@a.com'),(3,'Valeria Souza','a@a.com'),(4,'Alan Gomes','a@a.com'),(5,'Adonai','a@a.com'),(6,'Maria Terra','a@a.com'),(7,'Adonai 16:49','a@a.com'),(8,'Adonai 11:21','adonaibm@gmail.com'),(9,'Adonai 16:30','adonaibm@gmail.com'),(10,'Adonai 10:48','adonaibm@gmail.com'),(11,'Adonai 10:56','adonaibm@gmail.com'),(12,'Adonai 10:58','adonaibm@gmail.com'),(13,'Adonai 11:02','adonaibm@gmail.com'),(14,'Adonai 11:05','adonaibm@gmail.com'),(15,'Adonai 11:13','adonaibm@gmail.com'),(16,'Adonai 11:20','adonaibm@gmail.com'),(17,'Adonai 11:23','adonaibm@gmail.com'),(18,'Adonai 11:24','adonaibm@gmail.com'),(19,'Adonai 11:26','adonaibm@gmail.com'),(20,'Adonai 11:39','adonaibm@gmail.com'),(21,'Adonai 11:53','adonaibm@gmail.com'),(22,'Adonai 11:55','adonaibm@gmail.com'),(23,'Adonai 12:00','adonaibm@gmail.com'),(24,'Adonai 12:02','adonaibm@gmail.com'),(25,'Adonai 12:04','adonaibm@gmail.com'),(26,'Adonai 12:05','adonaibm@gmail.com'),(27,'Adonai 12:11','adonaibm@gmail.com'),(28,'Adonai 12:24','adonaibm@gmail.com'),(29,'Adonai 12:27','adonaibm@gmail.com'),(30,'Adonai 13:57','adonaibm@gmail.com1'),(31,'Adonai 13:55','adonaibm@gmail.com1'),(32,'Adonai 14:02','adonaibm@gmail.com'),(33,'Adonai 14:03','adonaibm@gmail.com'),(58,'Adonai 15:44','adonaibm@gmail.com'),(59,'Adonai 15:46','adonaibm@gmail.com'),(60,'Adonai 15:46','adonaibm@gmail.com'),(61,'Adonai 16:07','adonaibm@gmail.com'),(62,'Adonai 16:08','adonaibm@gmail.com'),(63,'Adonai 16:12','adonaibm@gmail.com');

/*Table structure for table `alunos_curso` */

DROP TABLE IF EXISTS `alunos_curso`;

CREATE TABLE `alunos_curso` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `idCurso` int(11) NOT NULL,
  `fkAluno` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_fkAluno` (`fkAluno`),
  CONSTRAINT `id_fkAluno` FOREIGN KEY (`fkAluno`) REFERENCES `alunos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=latin1;

/*Data for the table `alunos_curso` */

insert  into `alunos_curso`(`id`,`idCurso`,`fkAluno`) values (47,3021,8),(48,3016,8),(49,3021,9),(50,3030,9),(66,3021,31),(67,3021,30),(68,6162,32),(69,3021,33),(70,6056,33),(71,3022,33),(75,3021,58),(76,3021,59),(77,6056,60),(78,3021,62),(79,3021,63),(82,3023,1);

/*Table structure for table `alunos_telefone` */

DROP TABLE IF EXISTS `alunos_telefone`;

CREATE TABLE `alunos_telefone` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `telefone` varchar(255) NOT NULL,
  `fkAluno` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_fkAluno_tel` (`fkAluno`),
  CONSTRAINT `id_fkAluno_tel` FOREIGN KEY (`fkAluno`) REFERENCES `alunos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

/*Data for the table `alunos_telefone` */

insert  into `alunos_telefone`(`id`,`telefone`,`fkAluno`) values (15,'123',8),(16,'456',8),(23,'1231',31),(24,'4561',31),(25,'1',30),(26,'0202',32),(27,'123',33),(29,'123',59),(30,'123',60),(31,'123',62),(35,'456',1),(36,'789',1);

/*Table structure for table `usuarios` */

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE `usuarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario` varchar(20) NOT NULL,
  `senha` char(60) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `username_UNIQUE` (`usuario`)
) ENGINE=MyISAM AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;

/*Data for the table `usuarios` */

insert  into `usuarios`(`id`,`usuario`,`senha`) values (1,'admin','123'),(4,'admin1','123'),(2,'adonai','$2a$10$gb1sfy.2fYuTO118nKRySezhQ7uTilK4qwUoQY9yTK.EgBgueF5kW'),(3,'Leonardo','$2a$10$pZRmmvS9ClqKHVUKylo1V.FZJpVdrxzEMe8FvcZa.rd9vAU2AoYtO');

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
