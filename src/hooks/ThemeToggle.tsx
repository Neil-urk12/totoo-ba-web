import { useEffect, useState, type FC } from "react";
import { useTheme } from "next-themes";
import { FaRegMoon } from "react-icons/fa";
import { LuSun } from "react-icons/lu";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

const Button: FC<ButtonProps> = ({ className = "", children, ...props }) => (
  <button
    className={`flex items-center justify-center rounded-full h-9 w-9 hover:bg-gray-500 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

export const ThemeToggle: FC = () => {
  const { resolvedTheme, setTheme } = useTheme();
  const [isReady, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
  };

  if (!isReady) {
    return (
      <Button aria-hidden>
        <LuSun className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? (
        <LuSun className="h-5 w-5 text-yellow-400 transition-all" />
      ) : (
        <FaRegMoon className="h-5 w-5 text-slate-700 transition-all" />
      )}
    </Button>
  );
};
