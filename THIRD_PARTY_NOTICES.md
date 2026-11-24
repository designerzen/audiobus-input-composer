# Third-party references and artwork

The Plutchik star in `src/component/plutchik-art.ts` adapts the original SVG geometry and colours from [PhotoSYNTH.lol](https://github.com/designerzen/photosynth.lol), `source/webcomponent/star-controller/star-controller.svg`, at the user's request. The source working-tree SVG had SHA-256 `7ac56fe8ae76bbe1b3e43339ea190c3977e87bd6f7ab6f81429b349e4923238e` when the research mapping was recorded. PhotoSYNTH's package declares ISC; no separate root license text was found in the consulted checkout. This notice preserves provenance and does not assign a new license to upstream work.

The adaptation retains all 32 paths, assigns the documented 24 emotion/intensity selections, and changes interaction from chord triggering to latched emotion selection. No PhotoSYNTH synthesizer or controller code is copied.

Music-theory rules, mathematical methods and their proposed musical mappings are described in `docs/`. General methods do not establish a validated emotion model. No trained model, research dataset, recorded music or third-party composition engine is bundled.

Runtime composition and UI code have no package dependencies. TypeScript, Vite and Playwright are development tools with their own upstream licenses; see the lockfile for pinned versions.
