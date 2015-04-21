var ctrl;
$(document).ready(function () {
    ctrl = new Controller();
});

function Controller() {
    this.bar_chart = {};
    this.$count_num = $("#chart .count_num");
    this.post_count = 0;
    this.canvas, this.stage, this.exportRoot, this.sound;
    this.canvas = document.getElementById("canvas");
    this.exportRoot = new lib.post();

    this.stage = new createjs.Stage(this.canvas);
    this.stage.addChild(this.exportRoot);
    this.stage.update();

    createjs.Ticker.setFPS(lib.properties.fps);
    createjs.Ticker.addEventListener("tick", this.stage);


    this.socket = io('http://localhost');

    this.temperatureData = {};
    /*
    {value:"temperature",
        data:{
            tempLog:[num,num,,,,,],
            currentTemp:num
            }
    }

    */

    this.initChart();

    this.socket.on('connect', function (data) {
        console.log(data);
    });
    this.socket.on('message', function (msg) {
        if (msg.value == "temperature") {
            this.temperatureData = msg.data;
            this.setData2Chart(this.temperatureData.tempLog);
            this.setTemperature(this.temperatureData.currentTemp);
        }
    });
}
Controller.prototype.postFlag = function (b) {
    switch (b) {
    case 0:
        this.exportRoot.gotoAndStop(0);
        $("#post_message").hide();
        this.exportRoot.countpost = 0;
        $("#post_count").html("");
        break;
    case 1:
        if (this.exportRoot.currentFrame != 1) {
            this.exportRoot.gotoAndStop(1);
        }
        this.exportRoot.countpost++;
        this.exportRoot.play();
        $("#post_message").show();
        $("#post_count").html("");
        $("#post_count").html("postal items " + this.exportRoot.countpost);
        break;
    }
    this.post_count = this.exportRoot.countpost;
}
Controller.prototype.initChart = function () {
    var data = {
        labels: ["", "8:00", "", "12:00", "", "22:00", ""],
        datasets: [
            {
                fillColor: "#fff",
                strokeColor: "#fff",
                data: [0, 0, 0, 0, 0, 0, 0]
        }
      ]
    };
    var ctx = document.getElementById("myChart").getContext("2d");

    this.bar_chart = new Chart(ctx).Bar(data, {
        scaleOverlay: false,
        scaleOverride: true,
        scaleSteps: 2,
        scaleStepWidth: 20,
        scaleStartValue: 0,
        scaleLineColor: "rgba(0,0,0,.1)",
        scaleLineWidth: 1,
        scaleShowLabels: true,
        scaleLabel: "<%=value%>",
        scaleFontFamily: "'Arial'",
        scaleFontSize: 12,
        scaleFontStyle: "normal",
        scaleFontColor: "#fff",
        scaleShowGridLines: false,
        scaleGridLineColor: "#00CE9B",
        scaleGridLineWidth: 1,
        barShowStroke: true,
        barStrokeWidth: 1,
        barValueSpacing: 2,
        barDatasetSpacing: 0,
        animation: true,
        animationSteps: 60,
        animationEasing: "easeOutQuart",
        onAnimationComplete: null
    });
};
Controller.prototype.setTemperature = function (num) {
    this.$count_num.html("").text(num);
}
Controller.prototype.setData2Chart = function (ar) {
    /*
    [20,10,30,20,40,36,40]
    */
    var target_bar = this.bar_chart.datasets[0].bars;
    for (var i = 0; i < ar.length; i++) {
        if (i >= target_bar.length) {
            break;
        }
        target_bar[i].value = ar[i];
        this.bar_chart.update();
    }
};

Controller.prototype.getBarsLength = function () {
    return this.bar_chart.dataset[0].bars.length;
};
