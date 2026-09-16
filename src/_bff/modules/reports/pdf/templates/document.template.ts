import { PDF_CSS } from '@/_bff/modules/reports/pdf/styles'

/** Self-contained HTML document: Puppeteer blocks every network request, so styles are inline. */
export const documentTemplate = (body: string): string => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${PDF_CSS}</style>
</head>
<body>
${body}
</body>
</html>`
