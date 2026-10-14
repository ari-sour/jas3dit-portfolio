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

The hero displays the original image for five seconds after image load, then flips to `/assets/gojo-trailer.mp4` once playback can begin. This is a local copy of the supplied `Gojo Final.mp4`. Playback is muted and inline, with play/pause, sound, and replay controls. The trailer plays once. If autoplay is blocked, a Play trailer button appears; media errors retain the image. Reduced-motion users receive a short fade instead of the flip. Both media faces use a fixed 16:9 frame and contain their original proportions.

The supplied original Gojo artwork and official logo are stored in `public/assets` and used directly. The Gojo image retains its full 16:9 composition. The reference screenshot is not used as a website image.

Giyu Tomioka, Dark Knight Igris, and Kaiju No. 8 original images were not supplied. ArtStation blocked automated portfolio retrieval with HTTP 403. Their cards use explicitly labeled CSS placeholders, not substituted artwork. Add their original images to `public/assets` and update the `featured` records in `src/main.jsx` with image paths and descriptive alt text.

Publication dates are unverified. Set `date` to a verified ISO date to enable chronological ordering. Most Viewed remains disabled until real view data and a corresponding sorting implementation are connected.

The collection dialog contains all locally available works and links to the complete ArtStation portfolio. Contact actions use real email, phone, and social links; there is no unconnected submission form.
