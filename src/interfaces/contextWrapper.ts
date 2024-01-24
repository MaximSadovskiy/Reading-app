import { ThemeType, SetThemeType } from "@/hooks/useTheme";

export default interface GlobalContextInterface {
    theme: ThemeType;
    setTheme: SetThemeType;
};