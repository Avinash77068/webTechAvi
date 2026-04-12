interface TechSutraLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showTagline?: boolean;
}

import logo from "../assets/logo.png";

export default function TechSutraLogo({
  className = "",
  size = "md",
  showTagline = false,
}: TechSutraLogoProps) {
  const sizeMap = {
    sm: { width: "50px", height: "50px" },
    md: { width: "80px", height: "80px" },
    lg: { width: "120px", height: "120px" },
    xl: { width: "160px", height: "160px" },
  };

  const dimensions = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <div
        className="relative overflow-hidden rounded-lg flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm border border-primary/20 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <img
          src={logo}
          alt="TechSutra Logo"
          className="w-[85%] h-[85%] object-contain"
        />
      </div>
      {showTagline && (
        <div className="flex flex-col">
          <span className="font-heading font-bold text-xl gradient-logo-text leading-none">
            TechSutra
          </span>
          <span className="text-[10px] tracking-[0.2em] text-muted-foreground mt-1 uppercase">
            INNOVATE • ELEVATE
          </span>
        </div>
      )}
    </div>
  );
}
