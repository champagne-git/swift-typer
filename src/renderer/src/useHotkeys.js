import { onMounted, onUnmounted } from 'vue'

export const useHotkeys = (keyMap) => {
  const handleKeyDown = (event) => {
    // 获取按键组合
    const pressedKey = event.key.toLowerCase()
    const modifiers = {
      ctrl: event.ctrlKey,
      alt: event.altKey,
      shift: event.shiftKey,
      meta: event.metaKey // Command(Mac) 或 Windows 键
    }

    for (const [combination, callback] of Object.entries(keyMap)) {
      const keys = combination.toLowerCase().split('+')

      // 处理功能键（F1-F12）的情况
      if (keys.length === 1 && /^f(1[0-2]|[1-9])$/i.test(keys[0])) {
        if (pressedKey === keys[0]) {
          event.preventDefault()
          callback(event)
          return
        }
        continue
      }

      // 处理组合键的情况
      const key = keys.pop() // 最后一个是非修饰键
      const modifierKeys = new Set(keys) // 前面的都是修饰键

      // 检查是否所有需要的修饰键都被按下
      const allModifiersPressed = Array.from(modifierKeys).every((mod) => modifiers[mod])

      // 检查是否有多余的修饰键被按下
      const noExtraModifiers = Object.entries(modifiers).every(
        ([mod, isPressed]) => isPressed === false || modifierKeys.has(mod)
      )

      if (allModifiersPressed && noExtraModifiers && pressedKey === key) {
        event.preventDefault()
        callback(event)
        return
      }
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown)
  })
}
