const db = require('../models/index.js');
const echarts = require('echarts');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


function meaner(list) {
    var sum = 0;
    for (var i = 0; i < list.length; i++) {
        sum += list[i];
    }
    return sum / list.length;
}

function median(list) {
    list.sort(function (a, b) {
        return a - b;
    });
    var half = Math.floor(list.length / 2);
    if (list.length % 2) {
        return list[half];
    } else {
        return (list[half - 1] + list[half]) / 2.0;
    }
}

function mode(list) {
    var modeMap = {};
    var maxEl = list[0],
        maxCount = 1;
    for (var i = 0; i < list.length; i++) {
        var el = list[i];
        if (modeMap[el] == null) {
            modeMap[el] = 1;
        } else {
            modeMap[el]++;
        }
        if (modeMap[el] > maxCount) {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }
    return maxEl;
}

const range = (x,y) => x > y ? [] : [x, ...range(x + 1, y)];


function ranger(list) {
    var min = Math.min.apply(null, list);
    var max = Math.max.apply(null, list);
    return max - min;
}






module.exports = {

    statisticsAppointment: async () => {
        const uuid = uuidv4();

        const appts = await db.appointments.findAll({ raw: true });

        var mean = [];

        appts.forEach(function (appt) {
            var start = (appt.startTime.split(':')[0] * 3600) + (appt.startTime.split(':')[1] * 60) + appt.startTime.split(':')[2] * 1;
            var end = (appt.endTime.split(':')[0] * 3600) + (appt.endTime.split(':')[1] * 60) + appt.endTime.split(':')[2] * 1;
            var duration = Math.floor((end - start)/60);
            mean.push(duration);
        });

        const meaned = () => {
            var list = new Array(Math.max.apply(null, mean)+1).fill(0);
            for (var i = 0; i <= mean.length; i++) {
                list[mean[i]]++;
            }
            return list;
        }

        var meanedd = meaned();
        meanedd.forEach(function (item, index) {
            if (item == 0) {
                meanedd[index] = {
                    value: 0,
                    symbolSize: 0
                  };
            }
            })

        const chart = echarts.init(null, null, {
            renderer: 'svg', // must use SVG rendering mode
            ssr: true, // enable SSR
            width: 600, // need to specify height and width
            height: 400
        });
        chart.setOption({
            title: {
                text: 'Frequency of Appointment Durations'
            },
            //\u0021
            xAxis: {
                data: range(0,Math.max.apply(null, mean) + 1),
                name: `\n Range: ${ranger(mean)}  Mode: ${mode(mean)}  Median: ${median(mean)}   Mean: ${(Math.round(meaner(mean)) == meaner(mean)) ? meaner(mean) : "~" + new String(Math.round(meaner(mean)))}    Time (minutes)`,
                nameLocation: 'middle',
              },
              yAxis: {},
              series: [
                {
                  data: meanedd,
                  type: 'line',
                  smooth: true
                }
              ]
        });
        fs.writeFileSync(`${path.resolve(__dirname, '../')}/svg/${uuid}.svg`, chart.renderToSVGString());

        var status = 200;

        return {
            status: status,
            data: `${uuid}.svg`
        };
    },

    statisticsUrgancy: async (options) => {
        const uuid = uuidv4();

        const appts = await db.crisis.findAll({ raw: true });

        var mean = [];

        appts.forEach(function (appt) {
            mean.push(appt.urgency);
        });

        const meaned = () => {
            var list = new Array(Math.max.apply(null, mean)+1).fill(0);
            for (var i = 0; i <= mean.length; i++) {
                list[mean[i]]++;
            }
            return list;
        }

        var meanedd = meaned();
        meanedd.forEach(function (item, index) {
            if (item == 0) {
                meanedd[index] = {
                    value: 0,
                    symbolSize: 0
                  };
            }
            })

        const chart = echarts.init(null, null, {
            renderer: 'svg', // must use SVG rendering mode
            ssr: true, // enable SSR
            width: 600, // need to specify height and width
            height: 400
        });
        chart.setOption({
            title: {
                text: 'Frequency of Crises Urgencies'
            },
            //\u0021
            xAxis: {
                data: range(0,Math.max.apply(null, mean) + 1),
                name: `\n Range: ${ranger(mean)}  Mode: ${mode(mean)}  Median: ${median(mean)}   Mean: ${(Math.round(meaner(mean)) == meaner(mean)) ? meaner(mean) : "~" + new String(Math.round(meaner(mean)))}  Urgency level`,
                nameLocation: 'middle',
              },
              yAxis: {},
              series: [
                {
                  data: meanedd,
                  type: 'line',
                  smooth: true
                }
              ]
        });
        fs.writeFileSync(`${path.resolve(__dirname, '../')}/svg/${uuid}.svg`, chart.renderToSVGString());

        var status = 200;

        return {
            status: status,
            data: `${uuid}.svg`
        };
    }
};
