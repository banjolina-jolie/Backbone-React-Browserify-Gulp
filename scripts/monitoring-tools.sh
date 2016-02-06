
memory_report="*/5 * * * * ~/aws-scripts-mon/mon-put-instance-data.pl --mem-util --mem-used --mem-avail --from-cron"

crontab_exists() {
  crontab -l | grep -v "$memory_report"
}

if ! crontab_exists; then
	cd ~
	wget http://aws-cloudwatch.s3.amazonaws.com/downloads/CloudWatchMonitoringScripts-1.2.1.zip
	unzip CloudWatchMonitoringScripts-1.2.1.zip
	rm CloudWatchMonitoringScripts-1.2.1.zip
	echo 'Appending memory reporting cron job'
	crontab -l > currentCron
	echo "$memory_report" >> currentCron
	crontab currentCron
	rm currentCron
else
	echo 'No need to append memory reporting cron job to crontab, it is already there'
fi
