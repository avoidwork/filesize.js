# Security Policy

## Supported Versions

Only the latest major version receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| 6.x     | :white_check_mark: |
| < 6.0   | :x:                |

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not** open a public issue
2. Email security findings to the maintainers
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Assessment**: Within 1 week
- **Fix timeline**: Depends on severity
  - Critical: Immediate patch
  - High: Within 30 days
  - Medium/Low: Next release cycle

### Scope

This policy covers:
- Code execution vulnerabilities
- Data corruption or loss
- Authentication/authorization bypass
- Prototype pollution
- Dependency vulnerabilities affecting the core

### Safe Harbors

We will not take legal action against security researchers who:
- Follow this responsible disclosure process
- Make reasonable efforts to privacy and data protection
- Keep vulnerabilities confidential until patched

## Security Best Practices

When using filesize.js:
- Always validate input data before passing to filesize()
- Keep dependencies updated
- Use the latest stable version
- Review changelog for security-related updates

## Known Issues

No known security issues at this time.
