import IconButton from '@mui/material/IconButton'
import Brightness4Icon from '@mui/icons-material/Brightness4'
import Brightness7Icon from '@mui/icons-material/Brightness7'
import { useThemeContext } from '../context/ThemeContext'

function ThemeToggle() {
    const { themeMode, toggleTheme } = useThemeContext()

    return (
        <IconButton
            onClick={toggleTheme}
            aria-label={`Mudar para modo ${themeMode === 'light' ? 'escuro' : 'claro'}`}
            color="inherit"
        >
            {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>
    )
}

export default ThemeToggle
