FROM mysql:debian

RUN "mysql -u root -ptest123"

# Auth error fix
# https://stackoverflow.com/questions/52815608/er-not-supported-auth-mode-client-does-not-support-authentication-protocol-requ
RUN "ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'test123';"

# CREATE user TABLE
RUN "CREATE TABLE User(UserId int NOT NULL AUTO_INCREMENT, Username varchar(255) NOT NULL UNIQUE, Password varchar(255) NOT NULL, PRIMARY KEY (UserId));"

EXPOSE 3306
