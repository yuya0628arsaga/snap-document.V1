FROM --platform=linux/x86_64 mysql:8.0.28

# ADD .docker/local/mysql/my.cnf /etc/mysql/my.cnf
ADD my.cnf /etc/mysql/my.cnf

RUN chmod 644 /etc/mysql/my.cnf

RUN mkdir /var/lib/mysql-files || echo "already exists /val/lib/mysql-files directory"
