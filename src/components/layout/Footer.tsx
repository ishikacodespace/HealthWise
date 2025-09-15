import Link from 'next/link';
import { HeartPulse, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-card text-card-foreground border-t">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex flex-col items-start">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <HeartPulse className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-headline text-foreground">
                HealthWise
              </span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your partner in community health and wellness.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 font-headline">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Dashboard</Link></li>
              <li><Link href="/awareness" className="text-sm text-muted-foreground hover:text-primary transition-colors">Awareness</Link></li>
              <li><Link href="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-4 font-headline">Contact Us</h4>
             <ul className="space-y-2 text-sm text-muted-foreground">
                <li>contact@healthwise.community</li>
                <li>123 Health St, Wellness City</li>
             </ul>
          </div>
          <div>
             <h4 className="font-semibold mb-4 font-headline">Follow Us</h4>
             <div className="flex items-center space-x-4">
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter className="h-5 w-5" /></Link>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></Link>
             </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} HealthWise Community. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
