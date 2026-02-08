export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-satek/10 via-background to-background" />
      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight">
            <span className="text-satek">SAT</span>
            <span className="text-foreground">EK</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Smart Accessories Tools Electronics Knowledge
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
