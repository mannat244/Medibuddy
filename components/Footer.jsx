const Footer = () => {
  return (
    <footer className="border-t px-6 py-6 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-foreground">Medibuddy</p>
        <p>Medicine information from the FDA Drug Label API.</p>
        <p>For information only, not medical advice.</p>
      </div>
    </footer>
  );
};

export default Footer;
