#!/bin/sh
set -e

chown -R www-data:www-data /var/www/html
chmod -R 775 /var/www/html/core/cache
chmod -R 775 /var/www/html/core/config

exec php-fpm