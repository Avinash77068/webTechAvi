import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex items-center justify-center w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
      style={{
        backgroundColor: theme === 'dark' ? 'hsl(222, 30%, 18%)' : 'hsl(199, 89%, 48%)',
      }}
      aria-label="Toggle theme"
    >
      <span
        className="absolute left-1 inline-flex items-center justify-center w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md"
        style={{
          transform: theme === 'dark' ? 'translateX(0)' : 'translateX(28px)',
        }}
      >
        {theme === 'dark' ? (
          <Moon className="w-3 h-3 text-gray-800" />
        ) : (
          <Sun className="w-3 h-3 text-yellow-500" />
        )}
      </span>
      
      <span className="ml-1 flex items-center gap-5 px-1">
        <Moon className={`w-3.5 h-3.5 transition-opacity ${theme === 'dark' ? 'opacity-100 text-primary' : 'opacity-40 text-white'}`} />
        <Sun className={`w-3.5 h-3.5 transition-opacity ${theme === 'light' ? 'opacity-100 text-white' : 'opacity-40 text-muted-foreground'}`} />
      </span>
    </button>
  );
};

export default ThemeToggle;
