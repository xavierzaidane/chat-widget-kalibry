const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const prefixwrap = require('postcss-prefixwrap');

(async () => {
  const distCss = path.resolve(__dirname, '..', 'dist', 'chat-widget.css');
  const outCss = path.resolve(__dirname, '..', 'dist', 'chat-widget.scoped.css');

  if (!fs.existsSync(distCss)) {
    console.error('dist/chat-widget.css not found, run build first.');
    process.exit(1);
  }

  const css = fs.readFileSync(distCss, 'utf8');

  // Prefix everything under #kalibry-chat-widget-root
  const result = await postcss([ prefixwrap('#kalibry-chat-widget-root') ]).process(css, { from: undefined });

  fs.writeFileSync(outCss, result.css, 'utf8');
  console.log('Wrote', outCss);
})();