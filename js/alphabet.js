// 引入alphabet数据
const res = await fetch('../data/alphabet.json')
const alphabet = await res.json()

// 获取元素
const mainContentEl = document.querySelector('.main-content')
// 循环播放按钮
const btnEl = document.querySelector('.box .about-content .btn')

// 处理数据,渲染页面
// 创建content元素
const contentEl = document.createElement('div')
contentEl.className = 'content' // 添加类
mainContentEl.append(contentEl) // 添加到内容区
// 创建grid元素
const gridEl = document.createElement('div')
gridEl.className = 'grid' // 添加类
contentEl.append(gridEl) // 添加网格容器
for (const el of Object.keys(alphabet)) {
  // 创建item元素
  const itemEl = document.createElement('div')
  itemEl.className = 'item' // 添加类
  gridEl.append(itemEl) // 添加到网格容器
  itemEl.dataset.id = alphabet[el].src // 音频资源属性
  itemEl.dataset.ipa = alphabet[el].ipa // ipa音标属性
  itemEl.innerHTML = el.replace(/[0,1]$/, '') // item的主内容
  const span = document.createElement('span')
  span.innerText = alphabet[el].kk // 显示在字母下方的kk音标
  itemEl.append(span)
  const playEl = document.createElement('div')
  playEl.className = 'play'
  itemEl.append(playEl)
}

// 临时状态量
let latest_mp3 = new Audio() // 之前的音频文件(全局唯一音频实例状态量)
let latest_play_el = null // 之前的播放元素
let latest_item_el = null // 之前的活跃item元素

// 处理音频结束事件的函数
const handleAudioEnded = () => {
  if (latest_item_el) {
    latest_item_el.classList.remove('active')
  }
  if (latest_play_el) {
    latest_play_el.classList.remove('playing')
    // latest_play_el.classList.remove('like')
  }
}

// 移除旧的ended事件监听器
const cleanupAudioListener = () => {
  latest_mp3.removeEventListener('ended', handleAudioEnded)
}

// 字母点击事件
mainContentEl.addEventListener('click', (e) => {
  const item = e.target.closest('.item') // 获取.item元素
  if (item) {
    const id = item.dataset.id // 获取自定义属性,以音频名称命名
    // const like = item.dataset.ipa // 获取自定义属性,近似音
    const playEl = item.querySelector('.play')
    if (id) {
      // 先去除活跃元素,动画
      btnEl.classList.remove('active') // 移除循环按钮的活跃类
      btnEl.innerText = '循环播放' // 设置字体为原始状态
      if (latest_item_el) {
        latest_item_el.classList.remove('active')
      }
      latest_item_el = item
      if (latest_play_el) {
        latest_play_el.classList.remove('playing')
        // latest_play_el.classList.remove('like')
      }
      // 播放音频和动画
      latest_mp3.src = `./media/zhou/${id}.aac`
      // 清理旧的ended事件监听器，防止内存泄漏
      cleanupAudioListener()
      latest_mp3.loop = false // 不循环
      latest_mp3.play()
      latest_play_el = playEl
      playEl.classList.add('playing')
      // playEl.classList.add('like')
      // playEl.style.setProperty('--like-text', `"${like}"`)
      item.classList.add('active') // 当前元素设为活跃

      // 监听音频播放完毕
      // latest_mp3.addEventListener('ended', () => {
      //   playEl.classList.remove('playing')
      //   // playEl.classList.remove('like')
      //   item.classList.remove('active')
      // })
      // 监听音频播放完毕（只添加一次，通过cleanupAudioListener清理旧的）
      latest_mp3.addEventListener('ended', handleAudioEnded)
    }
  }
})

// 循环播放按钮
btnEl.addEventListener('click', () => {
  // 先去除字母的活跃元素,动画
  if (latest_item_el) {
    latest_item_el.classList.remove('active')
    latest_item_el = null
  }
  if (latest_play_el) {
    latest_play_el.classList.remove('playing')
    latest_play_el = null
    // latest_play_el.classList.remove('like')
  }

  // 判断是否有active类,就知道是否正在播放
  if (btnEl.classList.contains('active')) {
    // 有active类,正在播放,现在需要暂停
    latest_mp3.pause()
    btnEl.classList.remove('active') // 移除类
    btnEl.innerText = '循环播放'
    return
  }

  // 不包含active类,没有在播放,现在需要播放
  latest_mp3.src = '/media/zhou/whole.aac'
  latest_mp3.loop = true // 无限循环
  latest_mp3.play()
  btnEl.classList.add('active')
  btnEl.innerText = '正在播放'
})
