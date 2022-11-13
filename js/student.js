// 从localStorage取出username 登陆拦截
const { username, token } =
	JSON.parse(localStorage.getItem("userInfo")) ||
	(location.href = "login.html");

document.querySelector("#username").innerHTML = username;

// 退出功能
document.querySelector("#logout").addEventListener("click", function () {
	confirm("确定要退出吗?")
		? ((location.href = "login.html"), localStorage.clear())
		: "";
});

const tbody = document.querySelector("#tbody");

// 自己想的办法id变量用于添加和修改信息的判断
// let studentId = 0

const getStudentInfo = () => {
	// 请求学生列表
	axios
		.get("/students")
		.then(function ({ data }) {
			// 处理成功情况
			tbody.innerHTML = render(data);
			document.querySelector(".total").innerHTML = data.length;
		})
		.catch(function (error) {
			// 处理错误情况
			console.log(error);
		});
};

// 请求学生列表
getStudentInfo();

// 添加删除和修改事件
tbody.addEventListener("click", function (e) {
	// 删除
	if (e.target.classList.contains("bi-trash")) {
		if (!confirm("真的要删除吗?")) return;

		axios.delete(`/students/${e.target.dataset.id}`).then((r) => {
			setHint("删除成功");
			getStudentInfo();
		});
	}

	// 修改学生信息
	if (e.target.classList.contains("bi-pen")) {
		// 老师的办法给提交表单的按钮添加当前学员id  用于添加和修改信息的判断
		document.querySelector("#submit").dataset.id = e.target.dataset.id;
		// 打开模态框同时发起回显请求
		addStudenModal.show();
		// 请求城市列表
		getCityInfo();
		document.querySelector(".modal-title").innerHTML = "修改学员";
		axios({
			url: `/students/${e.target.dataset.id}`,
			method: "get",
		})
			.then(({ data }) => {
				// studentId = data.id

				// 利用forin遍历
				for (const key in data) {
					// console.log(data[key])
					// console.log(key)
					// console.log(document.querySelector(`#form input[name="${key}"]`))

					// 同时要跳过性别 否则的话会将 男的value值改成1的bug
					if (
						!document.querySelector(`#form [name="${key}"]`) ||
						key === "gender"
					)
						continue;
					document.querySelector(`#form [name="${key}"]`).value = data[key];
				}

				// 选中男女
				document.querySelector(`#cb0${data.gender + 1}`).checked = true;

				// 获取城市并选中当前资料的城市
				getCity.call(province, data["city"], data["area"]);

				// 获取地区并选择
				// getRegion.call(province.nextElementSibling, data['area'])
			})
			.catch((err) => {
				console.log(err);
			});
	}
});

// 添加学生模态框
const addStudenModal = new bootstrap.Modal(document.querySelector("#modal"));
// 打开添加学生模态框
document.querySelector("#openModal").addEventListener("click", function () {
	addStudenModal.show();
	// 请求城市列表
	getCityInfo();
	document.querySelector(".modal-title").innerHTML = "添加学员";
});

// bootstrap提供的事件
const StudenModal = document.querySelector("#modal");
// 模态框改变就触发
StudenModal.addEventListener("hidden.bs.modal", function (event) {
	// do something...
	// console.log(event)
	// 清空表单
	document.querySelector("#form").reset();
	// studentId = 0
	// 模态框改变就将 确认按钮的自定义属性移除
	document.querySelector("#submit").removeAttribute("data-id");
});

// 添加学生
document.querySelector("#submit").addEventListener("click", function () {
	const formInfo = serialize(document.querySelector("#form"), { hash: true });

	// 非空拦截
	const {
		name = "",
		age = NaN,
		gender = NaN,
		hope_salary = "",
		salary = "",
		group = "",
		province = "",
		city = "",
		area = "",
	} = formInfo;

	if (
		(name === "",
		age === "",
		hope_salary === "",
		salary === "",
		group === "",
		province === "",
		city === "",
		area === "")
	)
		return setHint("请不要留空");

	formInfo.age = +age;
	formInfo.hope_salary = +hope_salary;
	formInfo.salary = +salary;
	formInfo.group = +group;
	formInfo.gender = +gender;
	// console.log(this.dataset.id)

	// 共用一个请求
	// if (this.dataset.id) {
	//   // 发起修改请求
	//   console.log(111)
	//   console.log(formInfo)
	//   axios.put(`/students/${this.dataset.id}`, formInfo).then(({ message }) => {
	//     setHint(message)
	//     addStudenModal.hide()

	//     // 请求学生列表
	//     getStudentInfo()
	//   })

	//   return
	// }
	const url = this.dataset.id ? `/students/${this.dataset.id}` : `/students`;
	const method = this.dataset.id ? "put" : "post";

	// 发起添加请求
	axios({
		url,
		method,
		data: formInfo,
	})
		.then(({ message }) => {
			setHint(message);
			addStudenModal.hide();

			// 请求学生列表
			getStudentInfo();
		})
		.catch(({ message }) => {
			setHint(message);
		});

	// console.log(formInfo)
	addStudenModal.hide();
});

// 渲染学生列表
const render = (data) =>
	data
		.map(
			({
				id,
				user_id,
				name,
				age,
				gender,
				hope_salary,
				salary,
				group,
				province,
				city,
				area,
			}) => `
<tr>
        <td>${name}</td>
        <td>${age}</td>
        <td>${gender ? "女" : "男"}</td>
        <td>${group}</td>
        <td>${hope_salary}</td>
        <td>${salary}</td>
        <td>${province + city + area}</td>
        <td>
          <a href="javascript:;" class="text-success mr-3"><i data-id=${id} class="bi bi-pen"></i></a>
          <a href="javascript:;" class="text-danger"><i data-id=${id} class="bi bi-trash"></i></a>
        </td>
      </tr>
`
		)
		.join("");

// 省市区三级联动
// 请求省列表
const province = document.querySelector('select[name="province"]');
const getCityInfo = function () {
	axios({
		url: `/api/province`,
		method: "get",
	})
		.then(({ data }) => {
			province.innerHTML += getCityList(data);
		})
		.catch((err) => {
			console.log(err);
		});
};

const getCityList = (data) =>
	data.map(
		(res) => `
    <option value="${res}">${res}</option>
    `
	);

const getCity = function () {
	// console.log(args)
	// console.log(arguments)

	this.nextElementSibling.innerHTML = `<option value="">--城市--</option>`;
	this.nextElementSibling.nextElementSibling.innerHTML = `<option value="">--地区--</option>`;

	axios
		.get("/api/city", {
			params: {
				pname: this.value,
			},
		})
		.then(({ data }) => {
			// 处理成功情况
			this.nextElementSibling.innerHTML += getCityList(data);

			// console.log(this.nextElementSibling.value)
			// this.nextElementSibling.value = args[0] || '--城市--'
			// 获取修改学员信息 获取城市信息
			if (typeof arguments[0] !== "string") return;
			this.nextElementSibling.value = arguments[0];

			// 异步进程
			// 这一步放到请求外会在请求之前运行
			getRegion.call(this.nextElementSibling, arguments[1]);

			// this.nextElementSibling.value = arguments[0]
		});
};

const getRegion = function () {
	// console.log(arguments)
	// console.log(this.value)
	this.nextElementSibling.innerHTML = `<option value="">--地区--</option>`;

	axios
		.get("/api/area", {
			params: {
				pname: this.previousElementSibling.value,
				cname: this.value,
			},
		})
		.then(({ data }) => {
			// console.log(data)
			// 处理成功情况
			this.nextElementSibling.innerHTML += getCityList(data);

			if (typeof arguments[0] !== "string") return;
			this.nextElementSibling.value = arguments[0];
		});
};

// 给省份列表注册change事件请求城市列表
province.addEventListener("change", getCity);

province.nextElementSibling.addEventListener("change", getRegion);
