# Jas 3D It portfolio

Responsive React + Vite site, using JavaScript and CSS.

## Full-screen sections

Five viewport-sized pages: Home, Works, Services, About, and Contact. The persistent header, logo, and local hash links use a smooth vertical full-screen slide. There are no book frames or bottom navigation controls. URL hashes support deep links and browser back/forward. Down/up or Page Down/Page Up navigate, as do mobile vertical swipes. Wheel gestures are consumed until input has been quiet for 220 ms, preventing momentum from skipping pages. Overflow content scrolls within each page; reaching its boundary requires another gesture before moving to another page. Inactive and transitioning pages are inert and hidden from assistive technology. Reduced motion uses minimal transitions.

Home retains its media state across navigation. Playing trailers pause when leaving Home and resume at the same position on return; a manually paused or ended trailer remains paused. The left hero copy, accent line, and CTA links stay visible and interactive throughout all media states. A stronger gradient darkens the background beneath the copy without adding a text box. The caption fades from its original fill to a transparent gradient and stays transparent when paused or ended. Works has gallery pagination and a full-image lightbox. Small screens and short viewports retain internal scrolling.

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

### Gojo project in Works

The Gojo card opens a full-screen project at `#works/gojo/1`. Exactly three showcase groups use original local assets in `public/assets/gojo`, preserving their actual extensions and full compositions:

1. `jas-a-sculpt-gojo-6.jpg`, `jas-a-sculpt-gojo-2.jpg` — side by side.
2. `jas-a-sculpt-gojo-3.jpg`, `jas-a-sculpt-gojo-8.jpg`, `jas-a-sculpt-gojo-5.jpg`, `jas-a-sculpt-gojo-7.jpg` — a 2 × 2 grid in reading order.
3. `jas-a-sculpt-gojo-9.webp`, `jas-a-sculpt-gojo-10.webp` — vertically stacked comparison sheets.

No `gojo-4` is included. All eight files were found in Downloads and copied locally. Scroll, keyboard navigation, and small header controls change showcase pages using vertical slides. Mobile groups stack their images and scroll internally before another gesture advances the gallery. The last page never exits the project automatically. Individual images open a zoomable lightbox with Escape and focus restoration. Back to Works preserves the underlying gallery state and restores focus to the Gojo card. Project hashes support refresh and browser back/forward.

The hero displays the original image for three seconds after image load, then flips to `/assets/gojo-trailer.mp4` once playback can begin. This is a local copy of the supplied `Gojo Final.mp4`. Playback is muted and inline, with play/pause, sound, and replay controls. The full trailer alternates with the original image, with a three-second image interval between plays. If autoplay is blocked, a Play trailer button appears; media errors retain the image. Reduced-motion users receive a short fade instead of the flip. Both media faces use a fixed 16:9 frame and contain their original proportions.

An enlarged, darkened background trailer fades in behind only Home and the header. `HeroBackdrop.jsx` follows the foreground video's playing, pause, buffering, seeking, replay, playback-rate, and ending events, correcting drift greater than 180 ms. The background is always muted with zero volume, is excluded from accessibility, and cannot intercept clicks. Reduced-motion users retain the static background without loading the decorative video. Mobile disables background blur. The decorative layer is limited to the viewport and hidden on other pages.

The supplied original Gojo artwork and official logo are stored in `public/assets` and used directly. The Gojo image retains its full 16:9 composition. The reference screenshot is not used as a website image.

All nine Works projects now use original local artwork from the supplied files. No gallery artwork placeholders remain. Images preserve their source compositions and embedded branding.

Publication dates are unverified. Set `date` to a verified ISO date to enable chronological ordering. Most Viewed remains disabled until real view data and a corresponding sorting implementation are connected.

The collection dialog contains all locally available works and links to the complete ArtStation portfolio. Contact uses a direct two-column layout with all email, phone, location, and profile links visible. The name/email/message form validates required fields and opens a prefilled mailto draft in the user’s email app; it does not send messages from the website or show submission success.

### Giyu project in Works

Four original WebP images were found in Downloads and copied to `public/assets/giyu`. The Works card uses `jas-artworks-giyu-1.webp`. Two showcase pages contain images 1/2, then 3/4, side by side on desktop and naturally stacked on mobile. The shared project viewer preserves Gojo’s exact three groups and supports isolated scrolling, zoom, Back to Works focus restoration, and refresh/history at `#works/giyu/1` and `#works/giyu/2`.

### Igris and trailer controls

Five original `jas-a-sculpt-igris-1.webp` through `-5.webp` images were copied from Downloads into `public/assets/igris`. The real Works cover opens three pages: 1/2, 3/4, then 5. Existing project navigation, zoom, mobile scrolling, and focus/history behavior are shared.

Foreground trailer controls are icon-only SVG buttons at the bottom-right, 36px on desktop and 44px on touch devices. Playing controls reveal on mouse hover or keyboard focus. Touch taps reveal them for 2.5 seconds; paused, ended, and blocked playback keep controls visible. Labels and native tooltips describe each action. All hide timers are cleaned up; reduced motion disables fades. Background audio remains muted.

Home copy changes only on foreground media events: playing reveals “Hollow Purple. Brought to life.”, pause/buffering retain it, and ended/error/blocked playback restore the studio introduction. Ending also restores the original image and static background before the next three-second interval. Both copy versions occupy the same grid cells, reserving their largest responsive heights. Crossfade and 8px movement are disabled for reduced motion. Studio label, accent, and CTA links stay unchanged.

### Kaiju No. 8 project

All seven original `jas-a-sculpt-kafka-1.webp` through `-7.webp` images were found in Downloads and copied to `public/assets/kaiju`. The Works cover uses image 1. Four project pages show 1/2, 3/4, 5/6, then 7, retaining complete compositions and branding. Routes `#works/kaiju/1` through `/4` support refresh and history. The shared viewer provides mobile stacking, isolated scrolling, zoom, and Back to Works focus restoration.

### Separate Yuta and Kaitou Kid projects

Yuta Okkotsu’s Pure & Mutual Love and Phantom Thief, Moonlight Magician: Kaitou Kid are separate Works cards and project galleries. Each has nine original WebP images copied from Downloads into its own directory (`public/assets/yuta` and `public/assets/kaito`). Each gallery shows image 1 alone, then pairs 2/3, 4/5, 6/7, and 8/9, using distinct routes `#works/yuta/1` through `/5` and `#works/kaito/1` through `/5`. Their assets and gallery state are never combined.

### Works gallery and reference order

Works now opens directly as the compact thumbnail gallery, with names shown on hover/focus. The approved reference order is Goku, Yuta, Kaitou Kid, Unlimited Void, Giyu, Estes, Nuke Hollow Purple, Kaiju, Igris. Tiles use tightly spaced, filled previews; project galleries retain complete, uncropped originals. No dates are fabricated.

Unlimited Void is a separate project from the Home Nuke Hollow Purple artwork; all seven `gojo-void-1.webp` through `-7.webp` originals are local. Estes uses all five `jas-artworks-estes-1.webp` through `-5.webp` originals. Goku uses all eight actual Downloads files: `jas-artworks-1-goku-4.jpg`, `jas-artworks-2-goku-1.jpg`, `jas-artworks-3-goku-2.jpg`, `jas-artworks-4-goku-3.jpg`, `jas-artworks-5-close-up-1.jpg`, `jas-artworks-6-close-up-2.jpg`, `jas-artworks-7-dragon-close-up-1.jpg`, and `jas-artworks-8-dragon-close-up-2.jpg`. Each project has its own route and full-image zoom gallery.
