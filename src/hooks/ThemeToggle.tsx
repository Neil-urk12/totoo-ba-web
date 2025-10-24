/**
 * Theme Toggle Component
 * 
 * A button component that toggles between light and dark themes.
 * Uses next-themes for theme management and displays appropriate
 * icons (sun/moon) based on the current theme.
 * 
 * Features:
 * - Smooth theme transitions
 * - Persistent theme preference (localStorage)
 * - Accessible button with proper ARIA labels
 * - Icon changes based on current theme
 * - Prevents hydration mismatch with isReady state
 * 
 * @component
 * @example
 * <ThemeToggle />
 */
import { useEffect, useState, type FC } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Button props interface extending native button attributes
 * @interface ButtonProps
 */
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

/**
 * Styled button component for the theme toggle
 * 
 * @param {ButtonProps} props - Button properties
 * @returns {JSX.Element} A styled circular button
 */
const Button: FC<ButtonProps> = ({ className = "", children, ...props }) => (
  <button
    className={`flex items-center justify-center rounded-full h-9 w-9 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

/**
 * ThemeToggle Component
 * 
 * Renders a button that toggles between light and dark themes.
 * Shows a sun icon in dark mode and moon icon in light mode.
 * 
 * @returns {JSX.Element} The theme toggle button
 */
export const ThemeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  /**
   * Toggles the theme between light and dark
   * Updates both the theme context and data-theme attribute
   * @returns {void}
   */
  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!isReady) {
    return (
      <Button aria-hidden>
        <Sun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-all" />
      ) : (
        <Moon className="h-5 w-5 text-slate-700 transition-all" />
      )}
    </Button>
  );
};
