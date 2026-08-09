NO ADDITIVES (N/A) — LOCAL WEBSITE PACKAGE

HOW TO RUN
1. Keep this entire folder together.
2. Double-click START-WEBSITE.bat.
3. Or double-click index.html directly.

IMPORTANT
- Do NOT combine the HTML files into one file.
- index.html is the homepage.
- buy.html is the purchase-request page.
- terms.html is Terms & Conditions.
- privacy.html is Privacy Policy.
- style.css is shared styling.
- script.js is shared JavaScript.
- assets contains product/image files.

EMAIL
The current frontend does NOT have real email delivery credentials configured.
The purchase form must not falsely claim an email was delivered. Connect EmailJS or a backend before using it for real customer requests.

IMAGE ASSETS
The source package did not include the referenced product image files. Placeholder SVG assets are included so the website has no broken-image icons. Replace them with the final product photography when available.


EMAIL DELIVERY
---------------
The Request to Buy form is connected to EmailJS. It sends purchase requests to the configured No Additives Gmail account after EmailJS confirms successful delivery.

EmailJS Service ID: service_mj0mnkq
EmailJS Template ID: template_ws9o13s

The EmailJS public key is embedded in script.js because EmailJS public keys are intended for browser-side use. Never add a Gmail password or private key to this website.

If the email service is unavailable, the form shows an error instead of falsely reporting success.
