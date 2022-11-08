// 上面这个代码处理过度动画（默认加上不用管）
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.body.classList.add('sidenav-pinned')
    document.body.classList.add('ready')
  }, 200)
})

// 创建bootstrap弹窗
let toastBox = document.querySelector('#myToast')
const toast = new bootstrap.Toast(toastBox, {
  animate: true,
  autohide: true,
  delay: 3000
})


