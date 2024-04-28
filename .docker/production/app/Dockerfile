FROM php:8.2-fpm

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/bin/

RUN apt update -y && apt upgrade -y

RUN install-php-extensions \
    pdo_mysql \
    bcmath \
    mbstring \
    zip \
    opcache \
    gd \
    intl \
    redis \
    decimal \
    xdebug


RUN curl -sL https://deb.nodesource.com/setup_18.x | bash -
RUN apt install -y nodejs
RUN npm install --global yarn


COPY .docker/production/app/php.ini /usr/local/etc/php/php.ini

COPY . /app
WORKDIR /app

RUN ls /app

COPY .docker/production/app/www.conf.patch /usr/local/etc/php-fpm.d/www.conf.patch

RUN patch /usr/local/etc/php-fpm.d/www.conf /usr/local/etc/php-fpm.d/www.conf.patch

RUN chmod -R a+w /app/storage /app/bootstrap/cache

RUN cp .env.production.example .env
RUN php artisan key:generate