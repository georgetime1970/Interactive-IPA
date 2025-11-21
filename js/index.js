// 引入ipa数据
const res = await fetch('../data/ipa.json')
const ipa = await res.json()

// 获取元素
const mainContentEl = document.querySelector('.main-content')
// 处理数据,渲染页面
Object.keys(ipa).forEach((bigSort) => {
  // 创建content元素
  const contentEl = document.createElement('div')
  contentEl.className = 'content' // 添加类
  mainContentEl.append(contentEl) // 添加元音 辅音元素
  Object.keys(ipa[bigSort]).forEach((sort) => {
    // 创建sort元素
    const sortEl = document.createElement('div')
    sortEl.className = 'sort'
    sortEl.innerText = sort
    contentEl.append(sortEl) // 添加前元音 中元音 后元音元素
    // 创建grid元素
    const gridEl = document.createElement('div')
    gridEl.className = 'grid'
    contentEl.append(gridEl) // 添加网格容器
    ipa[bigSort][sort].forEach((e) => {
      // 创建item元素
      const itemEl = document.createElement('div')
      itemEl.className = 'item'
      gridEl.append(itemEl)
      itemEl.dataset.id = e.src
      itemEl.dataset.like = e.like ?? ''
      itemEl.innerHTML = e.ipa
      const span = document.createElement('span')
      span.innerText = e.word
      itemEl.append(span)
      const playEl = document.createElement('div')
      playEl.className = 'play'
      itemEl.append(playEl)
    })
  })
})

// 临时状态量
let latest_mp3 = new Audio() // 之前的音频文件(全局唯一音频实例状态量)
let latest_play_el = null // 之前的播放元素
let latest_item_el = null // 之前的活跃item元素

// 处理音频结束事件的函数
const handleAudioEnded = () => {
  if (latest_play_el) {
    latest_play_el.classList.remove('playing')
    latest_play_el.classList.remove('like')
  }
  if (latest_item_el) {
    latest_item_el.classList.remove('active')
  }
}

// 移除旧的ended事件监听器
const cleanupAudioListener = () => {
  latest_mp3.removeEventListener('ended', handleAudioEnded)
}

mainContentEl.addEventListener('click', (e) => {
  const item = e.target.closest('.item') // 获取.item元素
  if (item) {
    const id = item.dataset.id // 获取自定义属性,以音频名称命名
    const like = item.dataset.like // 获取自定义属性,近似音
    const playEl = item.querySelector('.play')
    if (id) {
      // 先去除活跃元素,停止之前的音频和动画
      if (latest_item_el) {
        latest_item_el.classList.remove('active')
      }
      latest_item_el = item
      if (latest_play_el) {
        latest_play_el.classList.remove('playing')
        latest_play_el.classList.remove('like')
      }
      // 播放音频和动画,设置元素状态
      latest_mp3.src = `./media/${id}.mp3`
      // 清理旧的ended事件监听器，防止内存泄漏
      cleanupAudioListener()
      latest_mp3.play()
      latest_play_el = playEl
      playEl.classList.add('playing')
      playEl.classList.add('like')
      playEl.style.setProperty('--like-text', `"${like}"`)
      item.classList.add('active') // 当前元素设为活跃

      // 监听音频播放完毕（只添加一次，通过cleanupAudioListener清理旧的）
      latest_mp3.addEventListener('ended', handleAudioEnded)
    }
  }
})
