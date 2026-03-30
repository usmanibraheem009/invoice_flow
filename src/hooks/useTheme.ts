import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { darkSemanticColors, lightSemanticColors } from '../theme/colors';

const useTheme = () => {
    const mode = useSelector((state: any) => state.themeReducer.currentMode);
    const systemTheme = useColorScheme();

    let activeTheme;

    if(activeTheme === 'system'){
        activeTheme = systemTheme == 'light'? lightSemanticColors : darkSemanticColors;
    }else{
        activeTheme = mode == 'light'? lightSemanticColors : darkSemanticColors;
    }

    return {mode, theme: activeTheme, isDark: activeTheme == darkSemanticColors}
}

export default useTheme;