# Jas 3D It portfolio

Responsive React + Vite site, using JavaScript and CSS.

## Run locally

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite (normally http://localhost:5173).

```sh
npm run build
npm run preview
```

## Assets and content

The supplied original Gojo artwork and official logo are stored in `public/assets` and used directly. The Gojo image retains its full 16:9 composition. The reference screenshot is not used as a website image.

Giyu Tomioka, Dark Knight Igris, and Kaiju No. 8 original images were not supplied. ArtStation blocked automated portfolio retrieval with HTTP 403. Their cards use explicitly labeled CSS placeholders, not substituted artwork. Add their original images to `public/assets` and update the `featured` records in `src/main.jsx` with image paths and descriptive alt text.

Publication dates are unverified. Set `date` to a verified ISO date to enable chronological ordering. Most Viewed remains disabled until real view data and a corresponding sorting implementation are connected.

The collection dialog contains all locally available works and links to the complete ArtStation portfolio. Contact actions use real email, phone, and social links; there is no unconnected submission form.
