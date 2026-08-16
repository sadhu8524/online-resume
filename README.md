# Ashish Sadhuka - Portfolio, Resume & Tech Blog

A lightweight personal engineering website for resume, technical writing, projects and recruiter contact.

## Site structure

- `/` - portfolio homepage
- `/resume.html` - original online resume, preserved unchanged
- `/blog/` - technical blog index
- `/blog/openshift-503-troubleshooting.html`
- `/blog/kubernetes-service-traffic.html`
- `/blog/gitops-security-baseline.html`
- `/api/contact.js` - Vercel serverless contact-email endpoint
- `/api/subscribe.js` - Vercel serverless newsletter subscription endpoint

## Run locally

Static pages can be previewed with:

```bash
python3 -m http.server 8080
```

The `/api/*` functions require a Vercel development/deployment environment.

## Email configuration

The site uses Resend through server-side Vercel functions. Configure these environment variables in Vercel Project Settings:

```text
RESEND_API_KEY=...
RESEND_FROM_EMAIL=Website <hello@your-domain.example>
CONTACT_TO_EMAIL=ashish852004@gmail.com
RESEND_AUDIENCE_ID=...
```

`RESEND_FROM_EMAIL` must use a sender/domain accepted by your Resend account.

No API keys are committed to this repository.

## Publishing a new blog post

1. Copy one of the HTML files under `blog/`.
2. Update title, description, article content and metadata.
3. Add a card for the post to `blog/index.html` and optionally the homepage.
4. Commit and push. Vercel will deploy the updated site when Git integration is enabled.

## Security basics

- Contact and subscription APIs validate inputs server-side.
- Both forms include a honeypot field for simple bot filtering.
- Message content is HTML-escaped before being used in email markup.
- Email credentials are environment variables, not frontend JavaScript.

## Existing resume

The original standalone resume remains available as `resume.html`, so the portfolio upgrade does not remove the previous design or print-to-PDF functionality.
