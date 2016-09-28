var fs = require('fs');
//返回格式化数据
/*
	{
		"/":{"headTime":469.5,"docTime":544,"jsTime":481.5,"winTime":537.5,'headSize':434,'docSize':23232},
		"/text1":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,'headSize':434,'docSize':23232},
		"/text2":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,'headSize':434,'docSize':23232}
	}
*/
function getContent(path) {
	if (!fs.existsSync(path)) {
		return '';
	}
	var data = fs.readFileSync(path, {
		'encoding': 'utf8'
	});
	var rows = data.split('\r\n');
	var savePage = {};
	for (var j = 0; j < rows.length - 1; j++) {
		var rowsDetail = rows[j].split('|');
		if (savePage[rowsDetail[0].split('=')[1]]) {
			savePage[rowsDetail[0].split('=')[1]].headTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].headTime) + parseInt(rowsDetail[1].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].docTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].docTime) + parseInt(rowsDetail[2].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].jsTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].jsTime) + parseInt(rowsDetail[3].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].winTime = (parseInt(savePage[rowsDetail[0].split('=')[1]].winTime) + parseInt(rowsDetail[4].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].headSize = (parseInt(savePage[rowsDetail[0].split('=')[1]].headSize) + parseInt(rowsDetail[5].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].docSize = (parseInt(savePage[rowsDetail[0].split('=')[1]].docSize) + parseInt(rowsDetail[6].split('=')[1] || 0)) / 2;
			savePage[rowsDetail[0].split('=')[1]].count++;
		} else {
			savePage[rowsDetail[0].split('=')[1]] = {
				headTime: rowsDetail[1].split('=')[1],
				docTime: rowsDetail[2].split('=')[1],
				jsTime: rowsDetail[3].split('=')[1],
				winTime: rowsDetail[4].split('=')[1],
				headSize: rowsDetail[5].split('=')[1],
				docSize: rowsDetail[6].split('=')[1],
				count: 1
			}
		}
	}
	return savePage;
}
//返回格式化数据
/*
	[
		{
			date:'2014-09-02',
			data:{
				"/":{"headTime":469.5,"docTime":544,"jsTime":481.5,"winTime":537.5,"headSize":3213,"docSize":432},
				"/text1":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,"headSize":3213,"docSize":432},
				"/text2":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,"headSize":3213,"docSize":432}
			}
		}
	]
*/
function getRangeData(startTime, endTime, data) {
	//data:2016-02-16##{"/":{"headTime":469.5,"docTime":544,"jsTime":481.5,"winTime":537.5,"headSize":3213,"docSize":432},"/text1":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,"headSize":3213,"docSize":432},"/text2":{"headTime":651,"docTime":704,"jsTime":652,"winTime":701,"headSize":3213,"docSize":432}}
	var startTime = new Date(startTime.split('-')[0], startTime.split('-')[1] - 1, startTime.split('-')[2]);
	var endTime = new Date(endTime.split('-')[0], endTime.split('-')[1] - 1, endTime.split('-')[2]);
	var re_data = [];
	var orginData = data.split('\r\n');
	for (var j = 0; j < orginData.length - 1; j++) {
		var d = orginData[j].split('##')[0];
		var temp = new Date(d.split('-')[0], d.split('-')[1] - 1, d.split('-')[2]);
		if (temp.getTime() >= startTime.getTime() && temp.getTime() <= endTime.getTime()) {
			re_data.push({
				date: d,
				data: JSON.parse(orginData[j].split('##')[1])
			})
		}
	}
	return re_data;
}
module.exports = {
	getContent: getContent,
	getRangeData: getRangeData
};