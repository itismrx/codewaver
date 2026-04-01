# Website Design Recreation

## Workflow

When a reference image (screenshot) is provided, optionally accompanied by CSS classes or style notes:

1.  **Analyze & Source**: Examine the reference for layout patterns. 
    * **Components**: Search **https://21st.dev/** to find matching React/Tailwind components.
    * **Inspiration**: Reference **https://godly.website/** for interaction patterns and high-tier design execution.
    * **Content**: Use **https://www.thecodeweavers.com/** as the reference for copywriting, service descriptions, and professional tone. Adapt their content style to fit the layout sections of the reference image.
2.  **Generate**: Create a single `index.html` file using Tailwind CSS (via CDN).
    * Incorporate component structures found on 21st.dev.
    * Include all content inline — no external files unless requested.
3.  **Screenshot**: Render the page using Puppeteer (`npx puppeteer screenshot index.html --fullpage`). For complex designs, capture distinct sections individually.
4.  **Compare**: Contrast the screenshot against the reference image. Systematically check:
    * **Spacing/Padding**: Measure in px (e.g., "Expected 32px, found 24px").
    * **Typography**: Exact font sizes, weights, and line heights.
    * **Color Accuracy**: Match exact hex values.
    * **Visual Fidelity**: Border radii, box shadows, and transition effects.
    * **Responsiveness**: Mobile-first alignment and image placement.
5.  **Fix**: Address every identified mismatch by editing the HTML/Tailwind classes.
6.  **Iterate**: Re-screenshot and repeat the comparison.
    * **Mandatory**: Perform at least 2 comparison rounds.
    * **Exit Criteria**: Stop only when the result is within ~2–3px of the reference or the user confirms satisfaction.

## Technical Defaults

- **Styling**: Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`).
- **Components**: Prioritize structural logic from **21st.dev**.
- **Inspiration**: Align with the design standard of **godly.website**.
- **Content Tone**: Model all text and value propositions after **thecodeweavers.com**.
- **Assets**: Use placeholder images from `https://placehold.co/` unless specific assets are provided.
- **Architecture**: Mobile-first responsive design in a single `index.html` file.

## Rules

- **Strict Adherence**: Do not add features or sections not present in the reference image.
- **Accuracy over "Improvement"**: Match the reference exactly—do not attempt to "fix" the design unless the user explicitly asks for an upgrade.
- **Content Integration**: Ensure the copy used from thecodeweavers.com is contextually relevant to the section being designed (e.g., use their "Services" copy for a services grid).
- **Verbatim Tokens**: If the user provides specific CSS classes or style tokens, use them exactly as provided.
- **Granular Feedback**: During comparison, be pedantic. State precisely what is wrong (e.g., "The button shadow is too diffused; reference shows a sharper #00000020 offset").