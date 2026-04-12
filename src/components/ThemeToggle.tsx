import { IconButton, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { useEffect } from 'react'
import * as storageService from '../services/storageService'

function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode()

  // Load saved theme on mount
  useEffect(() => {
    const savedTheme = storageService.getTheme()
    if (savedTheme !== colorMode) {
      toggleColorMode()
    }
  }, [])

  const handleToggle = () => {
    const newTheme = colorMode === 'light' ? 'dark' : 'light'
    storageService.setTheme(newTheme as 'light' | 'dark')
    toggleColorMode()
  }

  return (
    <IconButton
      aria-label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}
      icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
      onClick={handleToggle}
      variant="ghost"
    />
  )
}

export default ThemeToggle
