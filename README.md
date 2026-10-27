# Tiffin Lane – Food Shop Website

A static food shop site with a menu, cart and checkout. No backend or build step.

## Run it
Open `index.html` in a browser. (Fonts load from Google Fonts, so they need internet; a fallback font is used offline.)

## Edit it
- Menu items, prices, delivery fee: top of `js/app.js` (`MENU`, `FREE_AT`, `FEE`)
- Colours and fonts: `:root` variables in `css/style.css`
- Shop name and text: `index.html`

## Publish on GitHub Pages
    git init
    git add .
    git commit -m "Add food shop website"
    git branch -M main
    git remote add origin https://github.com/YOUR-USERNAME/food-shop.git
    git push -u origin main
Then in the repo: Settings > Pages > Deploy from branch > main > / (root).

## Note
Checkout does not send orders anywhere. To receive real orders, send the order summary to WhatsApp or email, or connect a form service.
