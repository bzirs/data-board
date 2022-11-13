// 获取提示框 的div
const toastBody = document.querySelector(".toast-body");

// 因为登录按钮不是submit按钮 所以无法注册submit事件 这样可以避免表单的默认行为
// 给注册按钮添加单击事件
document.querySelector("#btn-register").addEventListener("click", function () {
	// 获取注册的form表单
	const form = document.querySelector('form[role="form"]');

	// 获取表单内输入的值
	const formData = serialize(form, { hash: true });
	//判断用户名密码长度 2-30个字符 同时非空判断

	// 利用对象结构赋值 进行非空判断
	const { username = "", password = "" } = formData;

	// 非空判断
	if (username === "" || password === "")
		return setHint("用户名或密码不能为空");

	// 应该用正则校验
	// if (username.length < 2 || username.length > 30) return alert('用户名 长度为2-30字符')
	// if (password.length < 6 || password.length > 30) return alert('密码 长度为6-30字符')

	// 正则 \d 0-9 \D 非数字  \w a-zA-Z0-9  \W a-zA-Z0-9以外的字符 \s 空白字符(空格 tab 换页符等) \S 空白字符以外的字符

	// 用户名和密码的正则
	const regUser = /^\w{2,30}$/;
	const regPassword = /^\w{6,30}$/;

	// 判断用户名的正则
	if (!regUser.test(username)) return setHint("用户名 长度为2-30字符");

	// 判断密码的正则
	if (!regPassword.test(password)) return setHint("密码 长度为6-30字符");

	console.log(formData);

	// 发起注册请求
	axios
		.post("/register", formData)
		.then(({ data: { id, account }, message }) => {
			setHint(message);
			// 注册成功跳转登录页面
			setTimeout(() => {
				location.href = "login.html";
			}, 1000);
		})
		.catch(
			({
				response: {
					data: { message },
				},
			}) => setHint(message)
		);
});
