#!/usr/bin/env bash
##!/usr/bin/env bash
php artisan cache:clear
php artisan route:cache
php artisan config:cache
php artisan view:clear
composer dumpautoload
