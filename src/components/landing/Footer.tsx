
const Footer = () => {
  return (
    <footer className="py-8 px-4 sm:px-8 text-center border-t">
      <div className="max-w-7xl mx-auto">
        <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Clippo. All rights reserved.</p>
        <div className="mt-2 text-xs text-muted-foreground">
          <a href="#" className="underline hover:text-foreground">Terms of Service</a>
          <span className="mx-2">•</span>
          <a href="#" className="underline hover:text-foreground">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
