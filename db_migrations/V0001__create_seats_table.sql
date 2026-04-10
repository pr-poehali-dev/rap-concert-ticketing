
CREATE TABLE IF NOT EXISTS t_p28444642_rap_concert_ticketin.seats (
  id SERIAL PRIMARY KEY,
  row_num INTEGER NOT NULL,
  seat_num INTEGER NOT NULL,
  zone VARCHAR(20) NOT NULL,
  price INTEGER NOT NULL,
  is_taken BOOLEAN DEFAULT FALSE,
  taken_at TIMESTAMP,
  UNIQUE(row_num, seat_num)
);

INSERT INTO t_p28444642_rap_concert_ticketin.seats (row_num, seat_num, zone, price) VALUES
-- ZONE VIP (ряды 1-2, места 1-12, цена 5000)
(1,1,'vip',5000),(1,2,'vip',5000),(1,3,'vip',5000),(1,4,'vip',5000),(1,5,'vip',5000),(1,6,'vip',5000),
(1,7,'vip',5000),(1,8,'vip',5000),(1,9,'vip',5000),(1,10,'vip',5000),(1,11,'vip',5000),(1,12,'vip',5000),
(2,1,'vip',5000),(2,2,'vip',5000),(2,3,'vip',5000),(2,4,'vip',5000),(2,5,'vip',5000),(2,6,'vip',5000),
(2,7,'vip',5000),(2,8,'vip',5000),(2,9,'vip',5000),(2,10,'vip',5000),(2,11,'vip',5000),(2,12,'vip',5000),
-- ZONE PREMIUM (ряды 3-5, места 1-15, цена 3000)
(3,1,'premium',3000),(3,2,'premium',3000),(3,3,'premium',3000),(3,4,'premium',3000),(3,5,'premium',3000),
(3,6,'premium',3000),(3,7,'premium',3000),(3,8,'premium',3000),(3,9,'premium',3000),(3,10,'premium',3000),
(3,11,'premium',3000),(3,12,'premium',3000),(3,13,'premium',3000),(3,14,'premium',3000),(3,15,'premium',3000),
(4,1,'premium',3000),(4,2,'premium',3000),(4,3,'premium',3000),(4,4,'premium',3000),(4,5,'premium',3000),
(4,6,'premium',3000),(4,7,'premium',3000),(4,8,'premium',3000),(4,9,'premium',3000),(4,10,'premium',3000),
(4,11,'premium',3000),(4,12,'premium',3000),(4,13,'premium',3000),(4,14,'premium',3000),(4,15,'premium',3000),
(5,1,'premium',3000),(5,2,'premium',3000),(5,3,'premium',3000),(5,4,'premium',3000),(5,5,'premium',3000),
(5,6,'premium',3000),(5,7,'premium',3000),(5,8,'premium',3000),(5,9,'premium',3000),(5,10,'premium',3000),
(5,11,'premium',3000),(5,12,'premium',3000),(5,13,'premium',3000),(5,14,'premium',3000),(5,15,'premium',3000),
-- ZONE STANDARD (ряды 6-10, места 1-18, цена 1500)
(6,1,'standard',1500),(6,2,'standard',1500),(6,3,'standard',1500),(6,4,'standard',1500),(6,5,'standard',1500),
(6,6,'standard',1500),(6,7,'standard',1500),(6,8,'standard',1500),(6,9,'standard',1500),(6,10,'standard',1500),
(6,11,'standard',1500),(6,12,'standard',1500),(6,13,'standard',1500),(6,14,'standard',1500),(6,15,'standard',1500),
(6,16,'standard',1500),(6,17,'standard',1500),(6,18,'standard',1500),
(7,1,'standard',1500),(7,2,'standard',1500),(7,3,'standard',1500),(7,4,'standard',1500),(7,5,'standard',1500),
(7,6,'standard',1500),(7,7,'standard',1500),(7,8,'standard',1500),(7,9,'standard',1500),(7,10,'standard',1500),
(7,11,'standard',1500),(7,12,'standard',1500),(7,13,'standard',1500),(7,14,'standard',1500),(7,15,'standard',1500),
(7,16,'standard',1500),(7,17,'standard',1500),(7,18,'standard',1500),
(8,1,'standard',1500),(8,2,'standard',1500),(8,3,'standard',1500),(8,4,'standard',1500),(8,5,'standard',1500),
(8,6,'standard',1500),(8,7,'standard',1500),(8,8,'standard',1500),(8,9,'standard',1500),(8,10,'standard',1500),
(8,11,'standard',1500),(8,12,'standard',1500),(8,13,'standard',1500),(8,14,'standard',1500),(8,15,'standard',1500),
(8,16,'standard',1500),(8,17,'standard',1500),(8,18,'standard',1500),
(9,1,'standard',1500),(9,2,'standard',1500),(9,3,'standard',1500),(9,4,'standard',1500),(9,5,'standard',1500),
(9,6,'standard',1500),(9,7,'standard',1500),(9,8,'standard',1500),(9,9,'standard',1500),(9,10,'standard',1500),
(9,11,'standard',1500),(9,12,'standard',1500),(9,13,'standard',1500),(9,14,'standard',1500),(9,15,'standard',1500),
(9,16,'standard',1500),(9,17,'standard',1500),(9,18,'standard',1500),
(10,1,'standard',1500),(10,2,'standard',1500),(10,3,'standard',1500),(10,4,'standard',1500),(10,5,'standard',1500),
(10,6,'standard',1500),(10,7,'standard',1500),(10,8,'standard',1500),(10,9,'standard',1500),(10,10,'standard',1500),
(10,11,'standard',1500),(10,12,'standard',1500),(10,13,'standard',1500),(10,14,'standard',1500),(10,15,'standard',1500),
(10,16,'standard',1500),(10,17,'standard',1500),(10,18,'standard',1500),
-- ZONE FAN (ряды 11-14, места 1-20, цена 800)
(11,1,'fan',800),(11,2,'fan',800),(11,3,'fan',800),(11,4,'fan',800),(11,5,'fan',800),(11,6,'fan',800),(11,7,'fan',800),(11,8,'fan',800),(11,9,'fan',800),(11,10,'fan',800),(11,11,'fan',800),(11,12,'fan',800),(11,13,'fan',800),(11,14,'fan',800),(11,15,'fan',800),(11,16,'fan',800),(11,17,'fan',800),(11,18,'fan',800),(11,19,'fan',800),(11,20,'fan',800),
(12,1,'fan',800),(12,2,'fan',800),(12,3,'fan',800),(12,4,'fan',800),(12,5,'fan',800),(12,6,'fan',800),(12,7,'fan',800),(12,8,'fan',800),(12,9,'fan',800),(12,10,'fan',800),(12,11,'fan',800),(12,12,'fan',800),(12,13,'fan',800),(12,14,'fan',800),(12,15,'fan',800),(12,16,'fan',800),(12,17,'fan',800),(12,18,'fan',800),(12,19,'fan',800),(12,20,'fan',800),
(13,1,'fan',800),(13,2,'fan',800),(13,3,'fan',800),(13,4,'fan',800),(13,5,'fan',800),(13,6,'fan',800),(13,7,'fan',800),(13,8,'fan',800),(13,9,'fan',800),(13,10,'fan',800),(13,11,'fan',800),(13,12,'fan',800),(13,13,'fan',800),(13,14,'fan',800),(13,15,'fan',800),(13,16,'fan',800),(13,17,'fan',800),(13,18,'fan',800),(13,19,'fan',800),(13,20,'fan',800),
(14,1,'fan',800),(14,2,'fan',800),(14,3,'fan',800),(14,4,'fan',800),(14,5,'fan',800),(14,6,'fan',800),(14,7,'fan',800),(14,8,'fan',800),(14,9,'fan',800),(14,10,'fan',800),(14,11,'fan',800),(14,12,'fan',800),(14,13,'fan',800),(14,14,'fan',800),(14,15,'fan',800),(14,16,'fan',800),(14,17,'fan',800),(14,18,'fan',800),(14,19,'fan',800),(14,20,'fan',800);
