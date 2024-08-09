#!/bin/bash
# Run on local machine or setup code at mail service (for cron job)
# ./cron_send_backup_db.sh

# This file has purpose to cronly send backup database from VPS to email

# Need to change
PG_USERNAME="postgres"
PG_DATABASE="mimi_db"
CONTAINER_ID="ea18906e755a"
VPS_SSH="root@14.225.206.182"

# Set the directory to store the dump file
DUMP_DIR="./dist/modules/mail/mail-templates"

TIME_STAMP=$(date +%d-%m-%Y)
# Create a timestamp for the dump file name
NAME_FILE_BACKUP="$DUMP_DIR/$PG_DATABASE-$TIME_STAMP.dump"

# Export database dump from PostgreSQL container on VPS
echo "Exporting the database from the PostgreSQL container on VPS..."
ssh $VPS_SSH "docker exec -t $CONTAINER_ID pg_dump -U $PG_USERNAME -d $PG_DATABASE -F c -f /home/$NAME_FILE_BACKUP \
&& docker cp $CONTAINER_ID:/home/$NAME_FILE_BACKUP $DUMP_DIR \
&& docker exec -t $CONTAINER_ID rm /home/$NAME_FILE_BACKUP" \
&& echo "Export completed" \
&& echo "Dump file copied to $DUMP_DIR"
touch $NAME_FILE_BACKUP
