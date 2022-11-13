// 从localStorage取出username 登陆拦截
const { username, token } =
	JSON.parse(localStorage.getItem("userInfo")) ||
	(location.href = "login.html");

document.querySelector("#username").innerHTML = username;

// 获取学生统计信息
axios({
	url: "/dashboard",
	method: "get",
}).then((r) => {
	const {
		data: { provinceData, overview, year, salaryData, groupData },
	} = r;


	// 平均薪资走势图
	setPayTrend(year);

	// 班级薪资分布
	setPie(salaryData);

	// 柱状图
	setBar(groupData["1"]);

	// 男女薪资分布
	setDistribution(salaryData)

	// 籍贯
	setMap(provinceData);

	// 给柱状图的tab添加点击事件
	document.querySelector("#btns").addEventListener("click", function (e) {
		if (e.target.tagName === "BUTTON") {
			// console.log(e.target.innerHTML)
			// console.log(groupData[e.target.innerHTML])
			document
				.querySelector('button[class="btn btn-xs btn-blue"]')
				.classList.remove("btn-blue");
			e.target.classList.add("btn-blue");
			setBar(groupData[e.target.innerHTML]);
		}
	});

	// 遍历对象改变值
	for (const key in overview) {
		document.querySelector(`span[name="${key}"]`).innerHTML = overview[key];
	}
});

// 退出功能
document.querySelector("#logout").addEventListener("click", function () {
	confirm("确定要退出吗?")
		? ((location.href = "login.html"), localStorage.clear())
		: "";
});

// 设置薪资走势图
const setPayTrend = (year) => {
	const aveSalary = [];
	const Months = [];

	year.forEach((element) => {
		aveSalary.push(element.salary);
		Months.push(element.month);
	});

	const myChart = echarts.init(document.querySelector("#line"));
	// 薪资走势图
	const pay = {
		// 标题
		title: {
			text: "2021全学科薪资走向",
			top: 15,
			left: 10,
			textStyle: {
				color: "#000",
				fontSize: 16,
			},
		},
		// x轴
		xAxis: {
			type: "category",
			axisLine: {
				lineStyle: {
					color: "#ccc",
					type: "dashed",
				},
			},
			axisTick: {
				lineStyle: {
					color: "#999",
				},
			},
			data: Months,
		},
		// y轴
		yAxis: {
			type: "value",
			splitLine: {
				lineStyle: {
					type: "dashed",
				},
			},
		},
		// 数据
		series: [
			{
				data: aveSalary,
				type: "line",
				smooth: true,
				symbolSize: 10,
				// 填充区域的颜色
				areaStyle: {
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 0,
						y2: 1,
						colorStops: [
							{
								offset: 0,
								color: "#499FEE", // 0% 处的颜色
							},
							{
								offset: 0.8,
								color: "rgba(255, 255, 255, 0.2)", // 80% 处的颜色
							},
							{
								offset: 1,
								color: "rgba(255, 255, 255, 0)", // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
				// 填充线条颜色
				lineStyle: {
					width: 6,
					// 线性渐变，前四个参数分别是 x0, y0, x2, y2, 范围从 0 - 1，相当于在图形包围盒中的百分比，如果 globalCoord 为 `true`，则该四个值是绝对的像素位置
					color: {
						type: "linear",
						x: 0,
						y: 0,
						x2: 1,
						y2: 0,
						colorStops: [
							{
								offset: 0,
								color: "#499FEE", // 0% 处的颜色
							},
							{
								offset: 1,
								color: "#5D75F0", // 100% 处的颜色
							},
						],
						global: false, // 缺省为 false
					},
				},
			},
		],
		// 网格组件
		grid: {
			top: "20%",
		},
		// 鼠标放入提示
		tooltip: {
			trigger: "axis",
		},
	};

	myChart.setOption(pay);
};

// 饼状图 班级薪资分布
const setPie = (data) => {
	const myChart = echarts.init(document.querySelector("#salary"));

	const option = {
		title: {
			text: "班级薪资分布",
			textStyle: {
				fontSize: 16,
			},
			top: 15,
			left: 10,
		},
		tooltip: {
			trigger: "item",
		},
		legend: {
			bottom: "6%",
			left: "center",
		},
		series: [
			{
				name: "班级薪资分布",
				type: "pie",
				// 内外半径
				radius: ["50%", "64%"],
				// 中心位置
				center: ["50%", "45%"],
				avoidLabelOverlap: false,
				itemStyle: {
					borderRadius: 10,
					borderColor: "#fff",
					borderWidth: 2,
				},
				label: {
					show: false,
					position: "center",
				},

				labelLine: {
					show: false,
				},
				data: data.map(({ b_count, g_count, label }) => ({
					value: b_count + g_count,
					name: label,
				})),
			},
		],
		color: ["#FDA224", "#5097FF", "#3ABCFA", "#34D39A"],
	};

	myChart.setOption(option);
};

// 柱状图
const setBar = (data) => {
	const myChart = echarts.init(document.querySelector("#lines"));

	myChart.setOption({
		grid: {
			left: 70,
			top: 30,
			right: 30,
			bottom: 50,
		},
		tooltip: {
			trigger: "item",
		},
		xAxis: {
			type: "category",
			data: data.map(({ name }) => name),
			axisLine: {
				lineStyle: {
					color: "#ccc",
					type: "dashed",
				},
			},
			axisLabel: {
				color: "#999",
			},
		},
		yAxis: {
			type: "value",
			splitLine: {
				lineStyle: {
					type: "dashed",
				},
			},
		},
		series: [
			{
				data: data.map(({ hope_salary }) => hope_salary),
				type: "bar",
				name: "期望薪资",
			},
			{
				data: data.map(({ salary }) => salary),
				type: "bar",
				name: "就业薪资",
			},
		],
		color: [
			{
				type: "linear",
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{
						offset: 0,
						color: "#34D39A", // 0% 处的颜色
					},
					{
						offset: 1,
						color: "rgba(52,211,154,0.2)", // 100% 处的颜色
					},
				],
			},
			{
				type: "linear",
				x: 0,
				y: 0,
				x2: 0,
				y2: 1,
				colorStops: [
					{
						offset: 0,
						color: "#499FEE", // 0% 处的颜色
					},
					{
						offset: 1,
						color: "rgba(73,159,238,0.2)", // 100% 处的颜色
					},
				],
			},
		],
	});
};

// 籍贯
const setMap = (data) => {
	const myEchart = echarts.init(document.querySelector("#map"));

	const dataList = [
		{ name: "南海诸岛", value: 0 },
		{ name: "北京", value: 0 },
		{ name: "天津", value: 0 },
		{ name: "上海", value: 0 },
		{ name: "重庆", value: 0 },
		{ name: "河北", value: 0 },
		{ name: "河南", value: 0 },
		{ name: "云南", value: 0 },
		{ name: "辽宁", value: 0 },
		{ name: "黑龙江", value: 0 },
		{ name: "湖南", value: 0 },
		{ name: "安徽", value: 0 },
		{ name: "山东", value: 0 },
		{ name: "新疆", value: 0 },
		{ name: "江苏", value: 0 },
		{ name: "浙江", value: 0 },
		{ name: "江西", value: 0 },
		{ name: "湖北", value: 0 },
		{ name: "广西", value: 0 },
		{ name: "甘肃", value: 0 },
		{ name: "山西", value: 0 },
		{ name: "内蒙古", value: 0 },
		{ name: "陕西", value: 0 },
		{ name: "吉林", value: 0 },
		{ name: "福建", value: 0 },
		{ name: "贵州", value: 0 },
		{ name: "广东", value: 0 },
		{ name: "青海", value: 0 },
		{ name: "西藏", value: 0 },
		{ name: "四川", value: 0 },
		{ name: "宁夏", value: 0 },
		{ name: "海南", value: 0 },
		{ name: "台湾", value: 0 },
		{ name: "香港", value: 0 },
		{ name: "澳门", value: 0 },
	];

	let max = 0;
	dataList.forEach((element) => {
		const obj = data.find((pro) => pro.name.indexOf(element.name) !== -1);

		if (!obj) return;
		element.value = obj.value;
		max < obj.value ? (max = obj.value) : "";
	});

	let option = {
		title: {
			text: "籍贯分布",
			top: 10,
			left: 10,
			textStyle: {
				fontSize: 16,
			},
		},
		tooltip: {
			trigger: "item",
			formatter: "{b}: {c} 位学员",
			borderColor: "transparent",
			backgroundColor: "rgba(0,0,0,0.5)",
			textStyle: {
				color: "#fff",
			},
		},
		visualMap: {
			min: 0,
			max: 6,
			left: "left",
			bottom: "20",
			text: [max, "0"],
			inRange: {
				color: ["#ffffff", "#0075F0"],
			},
			show: true,
			left: 40,
		},
		geo: {
			// 地理坐标系组件
			map: "china",
			roam: false,
			zoom: 1.0,
			label: {
				normal: {
					show: true,
					fontSize: "10",
					color: "rgba(0,0,0,0.7)",
				},
			},
			itemStyle: {
				normal: {
					borderColor: "rgba(0, 0, 0, 0.2)",
					color: "#e0ffff",
				},
				emphasis: {
					areaColor: "#34D39A",
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					shadowBlur: 20,
					borderWidth: 0,
					shadowColor: "rgba(0, 0, 0, 0.5)",
				},
			},
		},
		series: [
			{
				name: "籍贯分布",
				type: "map",
				geoIndex: 0,
				data: dataList,
			},
		],
	};
	myEchart.setOption(option);
};

const setDistribution = (data) => {
	const myEchart = echarts.init(document.querySelector("#gender"));
	myEchart.setOption({
		title: [
			{
				text: "男女薪资分布",
				left: 10,
				top: 10,
				textStyle: {
					fontSize: 16,
				},
			},
			{
				text: "男生",
				left: "50%",
				top: "45%",
				textAlign: "center",
				textStyle: {
					fontSize: 12,
				},
			},
			{
				text: "女生",
				left: "50%",
				top: "85%",
				textAlign: "center",
				textStyle: {
					fontSize: 12,
				},
			},
		],
		tooltip: {
			trigger: "item",
		},
		color: ["#FDA224", "#5097FF", "#3ABCFA", "#34D39A"],
		series: [
			{
				type: "pie",
				radius: 50,
				radius: ["20%", "30%"],
				center: ["50%", "30%"],
				datasetIndex: 1,
				data: data.map(({label:name,g_count:value})=>({name,value})),
			},
			{
				type: "pie",
				radius: 50,
				radius: ["20%", "30%"],
				center: ["50%", "70%"],
				datasetIndex: 2,
				data: data.map(({label:name,b_count:value})=>({name,value})),
			},
		],
	});
};

// 没成功的获取数组
// const getInfo = (data, ...item) => data.map(({ item }) => item);
