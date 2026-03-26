interface HeaderProps {
  compact?: boolean;
}

const Header = ({ compact = false }: HeaderProps) => {
  return (
    <header
      className={compact ? "border-b border-border/60 bg-background" : "bg-background"}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-center px-4 ${
          compact ? "py-6" : "py-12 md:py-20"
        }`}
      >
        <div className="text-center">
          <h1
            className={`font-semibold tracking-tight ${
              compact ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl"
            }`}
          >
            <span className="text-foreground">Pharma</span>
            <span className="text-primary">Spot</span>
          </h1>
          <p className={`text-muted-foreground ${compact ? "mt-2 text-sm" : "mt-4 text-base"}`}>
            Pesquise o produto e veja o corredor.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
