import { useColorScheme } from "react-native";
import { useSelector } from "react-redux";
import { darkSemanticColors, lightSemanticColors } from "../theme/colors";

export const useTheme = () => {
    const mode = useSelector((state: any) => state.themeReducer.currentMode);
    const systemTheme = useColorScheme();

    let activeTheme;

    if(mode == 'system'){
        activeTheme = systemTheme == 'light'? lightSemanticColors : darkSemanticColors;
    }else {
        activeTheme = mode == 'dark' ? darkSemanticColors : lightSemanticColors;
    }

    return { mode, theme: activeTheme, isDark: activeTheme === darkSemanticColors};
}