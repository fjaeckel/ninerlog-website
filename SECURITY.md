# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability on the NinerLog website, please report it responsibly.

**Do NOT open a public GitHub issue for security vulnerabilities.**

Instead, please email **security@ninerlog.com** with:

- A description of the vulnerability
- Steps to reproduce the issue
- The potential impact
- Any suggested fixes (if available)

We will acknowledge receipt within 48 hours and aim to provide a fix within 7 days for critical issues.

## Scope

This policy covers the `ninerlog-website` repository, including:

- Static site content and markup
- Third-party CDN resources (fonts, icons)
- GitHub Pages deployment configuration
- Client-side JavaScript

## Security Practices

- **Static Site**: No server-side code, no database, no user input processing
- **CDN Integrity**: External resources loaded via trusted CDNs
- **Hosting**: GitHub Pages with enforced HTTPS

## Disclosure Policy

We follow a coordinated disclosure process. After a fix is released, we will publicly acknowledge the reporter (unless they prefer to remain anonymous).
