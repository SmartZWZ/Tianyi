const storageKey = "dancer:theme"

const qs = (sel) => document.querySelector(sel)

const setTheme = (theme) => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(storageKey, theme)
}

const getTheme = () => {
  const saved = localStorage.getItem(storageKey)
  if (saved === "light" || saved === "dark") return saved
  return "dark"
}

const attachTheme = () => {
  setTheme(getTheme())
  const btn = qs("#themeBtn")
  if (!btn) return

  btn.addEventListener("click", () => {
    const now = document.documentElement.dataset.theme === "light" ? "dark" : "light"
    setTheme(now)
  })
}

const attachAudio = () => {
  const audio = qs("#bgm")
  const btn = qs("#musicBtn")
  const label = qs("#trackLabel")
  const tracks = qs("#tracks")
  if (!audio || !btn) return

  const setBtn = () => {
    btn.textContent = audio.paused ? "播放" : "暂停"
  }

  const setActive = (activeBtn) => {
    if (!tracks) return
    const items = tracks.querySelectorAll(".track")
    for (const item of items) item.classList.toggle("is-active", item === activeBtn)
  }

  const setTrack = (trackBtn) => {
    if (!trackBtn) return
    const src = trackBtn.getAttribute("data-src")
    if (!src) return
    const title = trackBtn.getAttribute("data-title") || trackBtn.textContent || ""

    setActive(trackBtn)
    if (label) label.textContent = title.trim() || src

    if (audio.getAttribute("src") !== src) audio.setAttribute("src", src)
    audio.load()
  }

  const tryAutoPlay = async () => {
    try {
      await audio.play()
    } catch {
    } finally {
      setBtn()
    }
  }

  setBtn()

  btn.addEventListener("click", async () => {
    try {
      if (audio.paused) await audio.play()
      else audio.pause()
    } finally {
      setBtn()
    }
  })

  if (tracks) {
    tracks.addEventListener("click", async (e) => {
      const el = e.target instanceof Element ? e.target.closest(".track") : null
      if (!el) return
      setTrack(el)
      await tryAutoPlay()
    })

    const initial = tracks.querySelector(".track.is-active") || tracks.querySelector(".track")
    if (initial) setTrack(initial)
  }

  audio.addEventListener("play", setBtn)
  audio.addEventListener("pause", setBtn)

  tryAutoPlay()
  document.addEventListener(
    "pointerdown",
    () => {
      if (!audio.paused) return
      tryAutoPlay()
    },
    { once: true, capture: true }
  )
}

const hideBrokenImages = () => {
  const imgs = document.querySelectorAll("img")
  for (const img of imgs) {
    img.addEventListener(
      "error",
      () => {
        const parent = img.closest(".shot")
        if (parent) parent.style.display = "none"
        else img.style.display = "none"
      },
      { once: true }
    )
  }
}

const attachViewer = () => {
  const dialog = qs("#viewer")
  const img = qs("#viewerImg")
  const grid = qs("#galleryGrid")
  if (!dialog || !img || !grid) return

  grid.addEventListener("click", (e) => {
    const btn = e.target instanceof Element ? e.target.closest(".shot") : null
    if (!btn) return
    const src = btn.getAttribute("data-src")
    if (!src) return

    img.src = src
    if (typeof dialog.showModal === "function") dialog.showModal()
  })
}

attachTheme()
attachAudio()
hideBrokenImages()
attachViewer()
