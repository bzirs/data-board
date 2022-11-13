document.querySelector("#btn-login").addEventListener("click", function () {
	const form = document.querySelector('form[role="form"]');
	const formData = serialize(form, { hash: true });

	// 非空判断
	const { username = "", password = "" } = formData;
	if (username === "" || password === "")
		return setHint("用户名或密码不能为空");

	// 用户名和密码长度校验
	const regUser = /^\w{2,30}$/;
	const regPassword = /^\w{6,30}$/;

	if (!regUser.test(username)) return setHint("用户名长度为2-30个字符");
	if (!regPassword.test(password)) return setHint("密码长度为6-30个字符");

	// 发起axios请求
	axios
		.post("/login", formData)
		.then(({ data, message }) => {
			const { username, token } = data;
			setHint(message + "，欢迎您：" + username + "，一秒后将跳转到首页");
			console.log(data);
			// 将用户的信息存到localStorage
			localStorage.setItem("userInfo", JSON.stringify(data));

			// 跳转index页面
			setTimeout(() => {
				location.href = "index.html";
			}, 1000);
		})
		.catch(
			({
				response: {
					data: { message },
				},
			}) => {
				setHint(message);
			}
		);
});
