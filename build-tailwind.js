const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const fs = require('fs');

(async () => {
  const css = `
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  `;

  const result = await postcss([tailwindcss, autoprefixer]).process(css, {
    from: undefined,
    to: 'src/tailwind.output.css',
  });

  fs.writeFileSync('src/tailwind.output.css', result.css);
})();
