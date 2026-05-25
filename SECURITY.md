# 🔒 Security Policy

Thank you for helping keep **GitHub Tracker** and its community safe.

We take security vulnerabilities seriously and appreciate responsible disclosure from contributors, users, and security researchers.

Please report security issues responsibly and avoid public disclosure until the issue has been resolved.

---

# 📌 Supported Versions

The following table outlines the versions of the project currently receiving security updates and maintenance support.

| Version | Supported |
| ------- | --------- |
| Current development version | ✅ |
| Older versions | ❌ |

We recommend always using the latest version of the project to benefit from recent security fixes and improvements.

---

# 🚨 Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it responsibly.

## Please Do NOT

- Open a public GitHub issue for security vulnerabilities
- Publicly disclose the vulnerability before it has been reviewed
- Share exploit details publicly without prior coordination

---

# 📬 How to Report

Please report vulnerabilities by contacting the maintainers through one of the following methods:

- Open a private GitHub Security Advisory (if enabled)
- Contact repository maintainers through GitHub Discussions or direct GitHub communication
- Provide detailed reproduction steps and supporting information

When submitting a report, please include:

- Description of the vulnerability
- Steps to reproduce the issue
- Potential impact
- Screenshots or proof-of-concept (if applicable)
- Suggested fixes or mitigation ideas (optional)

---

# 🔍 What to Expect

After a vulnerability report is submitted:

1. The maintainers will review the report
2. The issue will be validated and assessed
3. A fix or mitigation strategy will be prepared
4. Security patches may be released if necessary
5. Responsible disclosure coordination will be followed before public release

We aim to acknowledge valid security reports within a reasonable timeframe.

---

# 🛡 Responsible Disclosure Guidelines

To help protect users and contributors, we request that you:

- Act in good faith
- Avoid accessing or modifying data that does not belong to you
- Avoid disrupting repository services or workflows
- Provide sufficient details for reproduction
- Allow maintainers reasonable time to investigate and resolve issues

---

# 🔐 Security Best Practices for Contributors

Contributors are encouraged to follow secure development practices:

- Keep dependencies updated
- Avoid committing secrets or API keys
- Validate and sanitize user input
- Follow secure authentication practices
- Review dependencies for known vulnerabilities

---

# 📦 Dependency Security

This project uses modern JavaScript and Node.js tooling including:

- React + Vite
- Node.js + Express
- TailwindCSS
- Axios
- MongoDB / Mongoose

Contributors should regularly audit dependencies using:

```bash
npm audit
```

To automatically fix non-breaking vulnerabilities:

```bash
npm audit fix
```

---

# 🤝 Security Acknowledgements

We appreciate responsible security disclosures and value the efforts of contributors helping improve the security and reliability of this project.

Thank you for helping make **GitHub Tracker** safer for everyone. 🚀