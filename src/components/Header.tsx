const Header = () => {
  return (
    <header className="border-b border-border/60 bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
            <span className="text-foreground">Pharma</span>
            <span className="text-primary">Spot</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Pesquise o produto e veja o corredor.
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;
