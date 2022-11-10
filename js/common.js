// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener("DOMContentLoaded", () => {
	setTimeout(() => {
		document.body.classList.add("sidenav-pinned");
		document.body.classList.add("ready");
	}, 200);
});

// 创建bootstrap弹窗
let toastBox = document.querySelector("#myToast");
const toast = new bootstrap.Toast(toastBox, {
	animate: true,
	autohide: true,
	delay: 3000,
});

// 封装显示提示信息
let setHint = (val) => {
	document.querySelector(".toast-body").innerHTML = val;
	toast.show();
};

// 配置axios基地址
axios.defaults.baseURL = "http://ajax-api.itheima.net";

// 添加请求拦截器
axios.interceptors.request.use(
	function (config) {
		// 在发送请求之前做些什么
		// console.log(config)
		// 在拦截器中判断localStorage 中是否存在token
		const userInfo = localStorage.getItem("userInfo");

		if (userInfo) {
			const { token } = JSON.parse(localStorage.getItem("userInfo"));

			// (location.href = "login.html")

			config.headers.Authorization = token;
		}
		// location.href = "login.html";

		return config;
	},
	function (error) {
		// 对请求错误做些什么
		return Promise.reject(error);
	}
);

// 添加响应拦截器
axios.interceptors.response.use(
	function (response) {
		// 2xx 范围内的状态码都会触发该函数。
		// 对响应数据做点什么
		// 脱壳
		return response.data;
		// return response;
	},
	function (error) {
		// 超出 2xx 范围的状态码都会触发该函数。
		// 对响应错误做点什么
		// console.dir(error);
		// 处理token过期
		// 如果报401错误就返回登录同时清空localStorage
		if (error.response.status === 401) {
			location.href = "login.html";
			localStorage.clear();
		}
		return Promise.reject(error);
	}
);
