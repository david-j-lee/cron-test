import DarkMode from '../icons/DarkMode'
import LightMode from '../icons/LightMode'
import { useCallback, useEffect, useState } from 'preact/hooks'

export default function ThemePicker() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!darkMode)
  }, [darkMode])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    setDarkMode(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      setDarkMode(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
    }
  }, [darkMode])

  return (
    <div class="theme-picker" onClick={toggleDarkMode}>
      {darkMode ? <LightMode /> : <DarkMode />}
    </div>
  )
}
