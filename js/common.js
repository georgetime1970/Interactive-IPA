// Service Worker 注册 - PWA 支持
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js')
      .then((registration) => {
        // console.log('Service Worker 注册成功:', registration)
      })
      .catch((error) => {
        // console.warn('Service Worker 注册失败:', error)
      })
  })
}

// 用于加载公共组件
const loadComponent = async (id, html) => {
  const el = document.querySelector(id)

  if (!el) return

  const res = await fetch(html)
  const content = await res.text()
  el.innerHTML = content
}

// 移动端导航栏点击按钮和中间标题
// DOMContentLoaded  html加载完成再执行,不然获取不到元素
document.addEventListener('DOMContentLoaded', async () => {
  // 加载所有公共组件
  await Promise.all([loadComponent('#navbar', '/components/navbar.html'), loadComponent('#footer', '/components/footer.html')])
  // await loadComponent('#navbar', '/components/navbar.html')
  // await loadComponent('#footer', '/components/footer.html')
  // 获取元素
  const btnEl = document.querySelector('.nav .menu-btn')
  const downBarEl = document.querySelector('.nav .mobile .downBar')
  const titleEl = document.querySelector('title') // 获取页面的大title元素
  const titleContextEl = document.querySelector('.nav .mobile .title')
  const aEl = document.querySelectorAll('.nav .pc a')

  // 显示标题文字(原理是根据当前网页大标题的内容设置)
  titleContextEl.innerText = titleEl.innerText.split('-').shift().trim()

  // 电脑端设置导航栏活跃颜色(原理是根据当前网页大标题的内容设置)
  aEl.forEach((el) => {
    if (titleContextEl.innerText === el.innerText) {
      el.style.color = '#49d391'
    }
  })

  // 移动端右侧图标切换
  btnEl.addEventListener('click', () => {
    downBarEl.classList.toggle('active')
    btnEl.classList.toggle('active')
  })
})
