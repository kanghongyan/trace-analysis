var fs = require('fs');
var schedule = require("node-schedule");
var getData = require('./getData');
var getContent = getData.getContent;
//每天3点执行
var rule = new schedule.RecurrenceRule();
rule.hour = 3;
rule.minute = 0;
var j = schedule.scheduleJob(rule, function() {　　
	console.log(new Date());
	console.log('执行');
	merge();
});
// j.cancel();
// merge();
/*性能统计合并*/
function merge() {
	var today = new Date();
	var today_date = getSplitDate(today);
	var yesterday = new Date(today_date.year, today_date.month, today_date.day - 1);
	var yesterday_date = getSplitDate(yesterday);
	//遍历data下目录将data目录的子目录下的文件合并到allData下
	projectsList = fs.readdirSync('data');
	for (var j = 0; j < projectsList.length; j++) {
		var year = yesterday_date.year;
		var month = (yesterday_date.month + 1).length > 1 ? yesterday_date.month + 1 : '0' + parseInt(yesterday_date.month + 1);
		var day = (yesterday_date.day + '').length > 1 ? yesterday_date.day : '0' + yesterday_date.day;
		var data = getContent('data/' + projectsList[j] + '/' + year + '-' + month + '-' + day + '.txt');
		if (data) {
			fs.appendFile('allData/' + projectsList[j] + '.txt', year + '-' + month + '-' + day + '##' + JSON.stringify(data) + '\r\n', 'utf8', function() {});
		}
	}
}
//返回年 月 日
function getSplitDate(date) {
	var year = date.getFullYear();
	var month = date.getMonth();
	var day = date.getDate();
	return {
		year: year,
		month: month,
		day: day
	}
}