/**
 * 自动生成 —— 不要手改。
 *   生成：node scripts/image-manifest.mjs   （已挂在 npm run prebuild）
 *
 * 用途见 scripts/image-manifest.mjs 顶部注释：
 * 给 next/image 提供真实宽高（消除图片加载前的 0 高度 = CLS）与 24px 模糊占位。
 * 没有条目 = 该图退化成现在的行为，不会报错。
 */

export type ImageMeta = {
  width: number;
  height: number;
  blurDataURL: string;
};

export const IMAGE_MANIFEST: Record<string, ImageMeta> = {
  "/diagrams/api-swap-internal.png": {
    "width": 1200,
    "height": 860,
    "blurDataURL": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAwBACdASoYABIAPt1cqU6opKOiMBgIARAbiWkAw6wR9iUCC509w3oAkMAA/vA5zOaF2/m7HDmzWY2HH6GJ3TGO792fhLuqEbp7LG/iicYW/4ElRx4b5dtDl6t5apT9rAATEqRDfE5K5KAA"
  },
  "/diagrams/ark-architecture.png": {
    "width": 4480,
    "height": 2720,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAABQAwCdASoYAA8APt1cpkyopSOiMAgBEBuJZQC2yC0B3McLuAD+8QAUOuu6fkYY1XdvuQI6SULMktdNi4fVIRNLcq/5zD/wcCQpeyaw43uKymq4qYmAAA=="
  },
  "/diagrams/ark-sequence.png": {
    "width": 3680,
    "height": 2880,
    "blurDataURL": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABQAwCdASoYABMAPt1kqE+opaOiKAqpEBuJZwDMHBEcSr/HsAD+8uPBopJKyoqe8ojpQ8R93gaqFWWgAAA="
  },
  "/diagrams/cors-debugging.png": {
    "width": 1200,
    "height": 860,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADQAwCdASoYABIAPt1orFCopaQiqAgBEBuJaQAAMWav7q1k74zjNQAA/u3XunxOxMUg5Ci1bwrWGOvkb+xyduksLkDLX1bSQcH53tB6jgAAAA=="
  },
  "/diagrams/data-driven-ui.png": {
    "width": 1200,
    "height": 820,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAADwAwCdASoYABEAPt1mp1AopaMiqAqpEBuJZwDO7BEUDhScxtyfPPAAAP7t2VpDCwNlsM8JTivUdsIEJAYjMYmtb0ibK5rzeUKnpW68DI0AAA=="
  },
  "/diagrams/deploy-naive-architecture.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYABAAPt1cpkyopSOiMAgBEBuJaQAAW/BMbbEMcXvgAAD+8DskqASJyyigcBD0dsYE5QNgJEGyjU3eMdPSsf+oQAA="
  },
  "/diagrams/deploy-to-public.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASoYABAAPt1apkyopSOiMAgBEBuJZwDLLCIKEj/y+k8iTOTOUAAA/u3XsrHW9oFuEKxOzoIbooUEPhb1DfwLUHUfJwl2aOBsL693anGEH0O06h++8rF25SXxeN4yVtAjTwC+xF8AAAA="
  },
  "/diagrams/fastapi-handmade-vs-framework.png": {
    "width": 1200,
    "height": 840,
    "blurDataURL": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoYABEAPt1gqU4opaOiMBgIARAbiWcAAC4/TctuMVFVO9MAAP7v4w8THlpKl+adno6ExvcZuQo800tcwWg6lfvPYg74YuGzG0bwiTctldKOu/E19zQdzMcAAAA="
  },
  "/diagrams/frontend-three-layers.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAQBACdASoYABAAPt1apkyopSOiMAgBEBuJZACsEf/gPQgV5houzFRsAAD+7dwMSzmkM3qvm/BE/A5dhhMFwBDkNZpG/KsQ5qMPVgHPtRDDItfl9DRmcoIIrBpNWQXJ0fvzr44P5NyMc6WFXb1by5KfV5siIAAA"
  },
  "/diagrams/git-commit-pipeline.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACQAwCdASoYABAAPt1apkyopSOiMAgBEBuJaQAAXK/zG55bCCkAAP7wOZhzjWsMx6QmqB4d3XjRycNKk/lSx+WsBAAAAA=="
  },
  "/diagrams/github-push-pull.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADQAwCdASoYABAAPt1cpkyopSOiMAgBEBuJZwAAXlvuo9rCZ+V/sxgA/u/jDL/xN01wdtvvO78YP1MyQUuOjHL6JUu8sHicH5/U4Ysagwdb/4tVZgrz2rD2HKKN3w+fBDyALajWAAA="
  },
  "/diagrams/glue-coding-metaphor.webp": {
    "width": 1264,
    "height": 848,
    "blurDataURL": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAACQBACdASoYABEAPt1kqE2opiOiMBgIARAbiWcAy6WMHG+cwpmA1I7cUsGMHoAA/vNvdJLQxM1jQIUQbiVomGHqdH/tgJEb/qDhbmWlIN3Rb1R7IuBfMBS3dR//g8qNV+jmIJjmxP3hL+jioVx69ZiAAAA="
  },
  "/diagrams/how-the-internet-works.png": {
    "width": 1200,
    "height": 860,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAADQAgCdASoYABIAPt1orFEopaQiqAgBEBuJZwAAPaOgAP7wrECi73Yvrjy2fGXUI/mJB14tl7OWbFLhebtCabaPv1Q85y4g+3MAAA=="
  },
  "/diagrams/http-request-response.png": {
    "width": 1200,
    "height": 840,
    "blurDataURL": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoYABEAPt1orFEopaQiqAgBEBuJZwDOdBEl5b7wRVmcAAD+7+JvbDjvcz3bgI44BOQhdUA3nETMF3wKHa6TvgAA"
  },
  "/diagrams/js-modules-before-after.png": {
    "width": 1200,
    "height": 820,
    "blurDataURL": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAADwAwCdASoYABEAPt1kqE2opiOiMBgIARAbiWUAyRAQ68TyMFdOfrwAAP7ti0W9CseVREiYHzO3O6eI9zIXfpNsDKC+Q/f2b0K2nKyXOzne162vNe810jZFpjjTxdYN55+ih4KHQ7/YUAAA"
  },
  "/diagrams/nextjs-deploy-paths.png": {
    "width": 1200,
    "height": 880,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABQAwCdASoYABIAPt1mp1AopaMiqAqpEBuJZwAALne1kgMUAAD+7+LvaH8VJr6rAW6DI+teMtTBsmOZyrCEqbemAyLHJ3NkPyEAAA=="
  },
  "/diagrams/nextjs-prerender.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRk4AAABXRUJQVlA4IEIAAACQAwCdASoYABAAPt1apkyopSOiMAgBEBuJZwDImCHgVzT0rdQAAP7wOcal5m7zTJMSGjaG1Tao7tQUm8/8W5kIAAA="
  },
  "/diagrams/p03-cli-setup-info.webp": {
    "width": 1264,
    "height": 848,
    "blurDataURL": "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABwBACdASoYABEAPt1iq08opSQiKAqpEBuJZQDPoYwwcSx/e3yJ//ovTz2owAD+8i6Ymlnu5bDmMLx1ipx+4qzs9WywUuFgX/gYgprQKdkWjEAzbaAFtFwPKkEYcDp6q4zplfJu3caVDdOmuZnSstM+19PqNWo32/3smF3EUS0QD4dVF8yZk0+Gla/2gAAA"
  },
  "/diagrams/p06-first-project-info.webp": {
    "width": 1264,
    "height": 848,
    "blurDataURL": "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAADwBACdASoYABEAPt1kqE+opaOmqAqpEBuJaQDPoywTlH+3DCPJxRzreS8FzP28mAAA/usci+uLYdrQeYfbf+Mb9vDdRjRPVrc8LSrdNoBPxX0Rrx7IWIx5ukOXQghNvkEcPD2XScR5yN6E/Ft8zeUX83stbKaXqij3GyzvH4yW4EBBN/Ipllc4Cz4W/ygM7UuoFILaAAA="
  },
  "/diagrams/path-absolute-vs-relative.png": {
    "width": 1200,
    "height": 1030,
    "blurDataURL": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABwBACdASoYABUAPt1orVCopaQiqAgBEBuJaQAALtfzTuYCs1rlD+Jprga9kAD+7eGbYP6oMSdVGtf69AGRNUsqEBngdA4i2DflsI7rSfV/KgzYT6t39t3pm2wAAA=="
  },
  "/diagrams/pypi-lib-workflow.png": {
    "width": 1200,
    "height": 800,
    "blurDataURL": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAADQAwCdASoYABAAPt1cpkyopSOiMAgBEBuJaQAAXfEJxZ5TUHbGtIAA/u/i/2UCWbnkSJtOmeWAKGmmky+DTtL/LMS7tuVUy9OAFi/bsm5J2gvjbDjwzWNx0xaIo3c+zak85ffFJeAAAA=="
  },
  "/diagrams/python-venv-setup.png": {
    "width": 1200,
    "height": 860,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoYABIAPt1orVEopaQiqAgBEBuJaQDO7BELg1PFGAAA/vA5zNpBfVuJU70l7IvXnQNGEnn9w02erl11EEnCOanrUAAAAA=="
  },
  "/diagrams/react-component-tree.png": {
    "width": 1200,
    "height": 920,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASoYABMAPt1orFEopaQjqAgBEBuJZwAALj+nzNcKYn+AAP7wOcS1V0mqw7AWBkGQrNK3DbqNcOH+SJzNa+VV2eAZ+thEKZN7tgOOAAAA"
  },
  "/diagrams/refactor-storage-two-steps.png": {
    "width": 1200,
    "height": 880,
    "blurDataURL": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAAAwAwCdASoYABIAPt1orFCopaQiqAgBEBuJaWtyWeAJzXGAAP7wwFnjHBazIUe8ZpUp9lG70KmO3GdE6J6GBYAA"
  },
  "/diagrams/server-ssh-nginx.png": {
    "width": 1200,
    "height": 840,
    "blurDataURL": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQBACdASoYABEAPt1iqE4opaOiMBgIARAbiWcAAC7R38vd1ZdB7JSYAAD+7deyikg3CVxTNugNJOhmwuv1OvqCED0SLRt+VrQdogdxWvLJLscFIxnxDiRBKBgZCDoZ06V6CwubGNAAAA=="
  },
  "/diagrams/session-cookie-why-stateless.png": {
    "width": 1200,
    "height": 820,
    "blurDataURL": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYABEAPt1orFCopaQiqAgBEBuJaQAALkeg+uvqV7ZHgAD+7+MPEx5aRHRSx1sMBEoUiZ2IZYvSPUHnKmFXGkAAAAA="
  },
  "/diagrams/sqlite-crud-injection.png": {
    "width": 1200,
    "height": 840,
    "blurDataURL": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAwCdASoYABEAPt1gqU4opaOiMBgIARAbiWkAzYQRSe2qL8FMWTcAAP7wObPiu+Icj80Ck1jjSfxQT3jScN7IVwS4GUlU53capqyYjaY+qEAzkgo9ccuABBqFqveBDAA="
  },
  "/diagrams/terminal-commands-cheatsheet.png": {
    "width": 1200,
    "height": 920,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAgCdASoYABMAPt1orVCopaQiqAgBEBuJZwAAPa2oAAD+8NNnZ8Vfhpe+uKemz+/xMokukzsU4T7jXygk7dTdIfZ8iOHvf4/Iy9fne5wUoQAA"
  },
  "/diagrams/vite-build-pipeline.png": {
    "width": 1200,
    "height": 820,
    "blurDataURL": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAAAwBACdASoYABEAPt1cqU6opKOiMBgIARAbiWcAznQREfUMLw3ze0IlaAAA/u3gvguDsFZLms65qKzTMGcqPDjOPV+uC58vVWvnmamAe95q6r7hn74ArAecaiZ+kMY7oqe40QAA"
  },
  "/diagrams/what-is-api.png": {
    "width": 1200,
    "height": 860,
    "blurDataURL": "data:image/webp;base64,UklGRmoAAABXRUJQVlA4IF4AAAAwBACdASoYABIAPt1eqU6opKOiMBgIARAbiWkAy6QREfyoAlWlFky5QAAA/vA5mFuOUCaXQyPiqGNW/EATc5EJMbaK/4bxYAe8Z/ieKBRovqqkdxdX7f/Go9uxqAAA"
  },
  "/gallery/2026-08-22-ming-dynasty-hanfu-film.webp": {
    "width": 1088,
    "height": 1445,
    "blurDataURL": "data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAABwBQCdASoYACAAPtFWpkyoJKOiMAwBABoJZQDDNCHguP7OnAiabZ1KoB2OlZiKN8L93S0AAP7uhQfDZajo8MfAlxZIVfso6AfZH8dwxMnsaZSrkVEwXD4mGVESAo2+Twy6SlTm5foxGfHLiKCaMhaewokwJR/+XfmZ/Ghj+RLnJxPO4F1KagPph7HrxYMubaeCG/ZWHlppTmg1BsGtCMyTF236p00GaIAAAA=="
  },
  "/gallery/2026-08-22-paper-cut-wonderland.webp": {
    "width": 1254,
    "height": 1254,
    "blurDataURL": "data:image/webp;base64,UklGRgoBAABXRUJQVlA4IP4AAACQBQCdASoYABgAPt1mqlEopSOiqAgBEBuJQBfnMW5OaOPyKx3nk34vaPRo8mRfFIrKcJDkAADib3eHo28Y15L3xjN1VMeXa/jE/mxnV3Byh7jocdpbwmAyAQcoW/k+C+hZFio7M1F2ynWReUSa858VHUjghy6kz9uBdgT+Z8aExUk5JmHbOX2vavNp9LxiWWqVqRBNDKALEmabEcQlipGs9uhXCPqQhYZI94735eeTn/z4h3wg0lEkQ/R27ox2y35EH6iXxJY6VLo4cGmlaZXYYA6/kr4NNKtRQYAR05lCmcsqDlppyuWr94JHe8/PDOUBb0wkdkqy32EIEQAAAA=="
  },
  "/gallery/2026-08-22-selective-color-orange-sunglasses.webp": {
    "width": 1254,
    "height": 1254,
    "blurDataURL": "data:image/webp;base64,UklGRtoAAABXRUJQVlA4IM4AAACwBQCdASoYABgAPt1iqk8opaOiKAqpEBuJZwAD5UELWkC4lLDw8B6eLQW/kgkPPJTEAUbuxAAA/vEv84BjljYz49j5YOFQqLzC1wYxe9uHNNbuFrZh/tsFmXCd3X7dQj3defRQZug4bSOiiuI0tvZLmOnbhKzcP2+zSrDB+Sn7QJg1jbyiMasyRDk8lkEOHfovOCoeMo7OlEaoF3vniJK813DvDvQNPecCnU2tT4cXM1lIZjKfzmr5Nx2QYazYN52SANNPoZwzBFQhA1qAAA=="
  },
  "/gallery/2026-08-22-times-square-motion-blur.webp": {
    "width": 1088,
    "height": 1445,
    "blurDataURL": "data:image/webp;base64,UklGRoQBAABXRUJQVlA4IHgBAAAQCACdASoYACAAPt1ep0yopSOiMAgBEBuJbACdMuME0osaAc9VY9T0Ab0QMFM98ox6J+3egoKRj3Bqj5wOepFgV9W91E8iXG6AAP4z+lRVK98xyGITPJ+gp/tZ7rkNNMGXLmTEvuN0hPh4WGx0+2aIO3RTTEyeI4iyTuWhRPj0k8SLjroZvBGPfTBEqvmukCcsr+GvMeOpl3ynLqf6CWb69Od0K5QoKI14qB964h8q2+r/FfNX+VXOxfwR6W5ozh5+W6Ouw1i8Srml3vL/wkXKnOA9cY638ngAR6lCM3EiJNOwWVans6o0zEatcZnZLLliRheSGf17ZXPLPgHsby4m1N+VePbYdbQ4o8OHpdGACZkKwECEnjzt0an2bv7ze+vvKiW8DaTw6cPb1srcXeqbfwlO+K2zoksYCz3wJLRK5/IJmrT5bJIEeTz+96wwJ06gkWZSv1PyWlgfwwAPFbIK9iwFRh0zeV7dkErNRr4eacheAFEKiAAA"
  },
  "/gallery/2026-09-20-extreme-closeup-portrait.webp": {
    "width": 768,
    "height": 1376,
    "blurDataURL": "data:image/webp;base64,UklGRhQBAABXRUJQVlA4IAgBAAAQBwCdASoYACsAPt1mqk+opaOiKqgBEBuJYwDGQBYhubwaTEKfSel+1yTozrOVUmB2Or0yXg0sLPqmZ7TYP8TQAAD+8ZMn/WHrG+3c4yeM2G2SnR9BtCBsqZL1VP2Zq0avVnrncd5iklDu1N67CvTI8dr4+OMs8791lgIAq3P2QoulXXgMbvW+D/JdmK02Yrc2oPVYaMYfCWdb1d+fA83cv2kQF+k8L3OAXMXaMwJ9OtPhdUUnSRstZHneKxnsCT9W+nzlqe8BMebbyX1BidmR16NzsZlBSg/+Gp1VEt9/4GtPcLMBzUpwiNpRaQsOdsCavvQVhC46rgX6MgdSA7+WZYka0LkWAAA="
  },
  "/images/blog/2026-03-21-openclaw-youtube-reading-comprehension/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwC7ABugORpMGayoAAD+1eulJ+vJHpx4n2j0r3oEQ+4RrTx4nOMB1iVfQ/f7SfHAAA=="
  },
  "/images/blog/2026-04-20-ai-fable-prompt/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAAAwAwCdASoYAA4APt1epkyopSOiMAgBEBuJZwAAetDvp7oAAP7vaCurEUMBe4/rD+9p7snKhXVw7fNzGnViuOsYXPxjG5yY39SdWHzuEco2xQAA"
  },
  "/images/blog/2026-05-10-agentic-workflow/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZwAAW+z4OAxTrp0UAAD+0xo1Etwxr2gzjfC/vDSbOp80/jr4kfPixuxpLTDepRUdP3ANCvcBN3QBTIF7PZBEfYSDt3HAAAA="
  },
  "/images/blog/2026-05-20-ai-enterprise-efficiency/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwAAW9u/zIZ+XjEMAAD+5yfKtjf3KXJlQZ0aKtfJ7OmarOJH4zZshrL6J+ydQgAAAA=="
  },
  "/images/blog/2026-05-25-computational-thinking-guide/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAABwAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwAAW/BUBdR/t3AA/u1YCq4IzETYRITCK+zTMCZJUW9c6zPsg6jGfZaqbHOzDvFwAA=="
  },
  "/images/blog/2026-06-08-first-note/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwCo9CB0JP8pFq19wPB4AAD8xl/Qvj4QAjwk9ekpBsksQKPaNsI2Pqh6H5Wfa6JaCZ6EfgooUBv4+xaOgAAA"
  },
  "/images/blog/2026-06-12-color-rendering-ark-seedream/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAAAwBACdASoYAA4APt1cp0yopSOiMAgBEBuJZQC7ACHiGCKadzNXNZKgsAAA/tMqeJg1jUmW8fEj4ulW9dR+qe+MpNLyIDrromdXkx34SdxkbnC6SPpMC4kUg5vIzRmga9Vi1Wb4brQs7H2O7AA="
  },
  "/images/blog/2026-06-12-hermes-feishu-bot-config/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQC+SCHcf5PJj7X+ye5AAP7vu/FZm/t0ZNJ4vzQh9KlHe4xlc1OF/lKBdKWaIFQM/e+EbLcOqGaAAAA="
  },
  "/images/blog/2026-06-25-why-write-prd-spec-before-project/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAABQBACdASoYAA4APt1epkyopSOiMAgBEBuJaQDImYuG36064LnFtFFEsrmYAP7x2pl/SPpuAOH/7jdKW6NcelPSCwoALb82a1vii4OjJmsvKFRN7jPz96b3YPNkTmfkDqd38Qa2D33iY8YIZqBgAA=="
  },
  "/images/blog/2026-07-09-api-basics/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlQAAABXRUJQVlA4IEgAAACwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQC7ACHe96tYQpIVIAD+7Xo6Vko+KteBDRfbNbcI6Y3K85uac1OPCENxmkyAAAA="
  },
  "/images/blog/2026-07-09-git-version-control/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAwCdASoYAA4APt0+s1SooiWjmAEQG4lnAABchV2yEvNIC3KgAP7tRPc3eorL4T5Qr2XcbNn6AasXInLrDY30ygx/VkcqEh6BLjWfN+gAAA=="
  },
  "/images/blog/2026-07-09-github-remote-and-mcp/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACQAwCdASoYAA4ALqVut1ujKKioiICkSzgF8kId6x2ktpGgB0cgAP75cgCmT8DJF1rWYveqi8W2KhWiV3/TQExM1oW/GpGaIj1fTMuMNQju+2xGu20ulVvvTufbHv7LHUAAAA=="
  },
  "/images/blog/2026-07-09-how-network-work/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADQAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwC+SCHes4dN9oRj3AAA/uqBtefoxKolXqRDrFENtCRL7rMBRw4KXblrKsOVLG2Ji7V1JpjXZBTCBRMuufits2n2+FoD8AA="
  },
  "/images/blog/2026-07-09-js-modules-history/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAADQAwCdASoYAA4APt1cp0yopSOiMAgBEBuJaQDCgB49UnU+uLn8+AAA/sP9s4IcymVoqE9D+qMmOGc3GvMf7/0hzaT/tb739YaiTvcdEGyDaa4vEAA="
  },
  "/images/blog/2026-07-09-know-your-computer/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAwBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwDG9CHetpQNGQv+BnszkAAA/u/SrrX4YtX4OzPaVNbeviJETgThharedC6Kp0lVPz/DpEGIIfQwhv0YUEQdDduzt50cg9L/JErny/BAasLa32M02qHKT3A1ggAA"
  },
  "/images/blog/2026-07-09-npm-and-vite/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwDImCHQSpbC8zcE+AD+6ncVpA4D16+lVsWWTOegqJjuTxCbj1Mfr89axeUJJ+WQRK8IVlAfvAGHHzPj9NVY+bxhkrSS7PqsEV9hSAA="
  },
  "/images/blog/2026-07-09-react-data-driven-ui/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoYAA4APt1cqE0opSQiMAgBEBuJZwCsACHhnAdM1hGuEgyIAP7TUpQkXGPzpoSQfkfFQV6CO3d9wrnrFiq24wQSbCrU5x9wipEGXyL1QSuangAA"
  },
  "/images/blog/2026-07-09-react-frontend-rules/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACQAwCdASoYAA4APt1cp0yopSOiMAgBEBuJZwDA3CHhmUa/7d0AAP7DhjZAMPjpa3GMi1Ddffa4argznEEBaQ1MYTaEftNT3nTfHjHtovYzu/owAAA="
  },
  "/images/blog/2026-07-09-server-deploy-and-nginx/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZwC7ACHgCyXUuPYp7lAA/ow6uTsTusXqJ86JrnU+gzCikUWBGX62JoVEYsiQb9pvsS1A1GCSVXTPcTkQAA=="
  },
  "/images/blog/2026-07-09-terminal-linux-basics/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoYAA4APt1cp0yopSOiMAgBEBuJZwC+SCHhgTwVGf5jrIAAAP7zfaIBZ1A7SXvrJpgy3lBT1Oi4rV8sjR2VMEYi4r3a/ymaHkiNEf68xhhmQ0wA"
  },
  "/images/blog/2026-07-21-api-practice-review/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAABQAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZwDE2CHfh/ToMAD+79ATA8U9f7n15G1Gfp0hL7alG3ZKjwxMA1sJ6zvBej42DsXUzDKyWkCEUi4lpOV7X6S2WAAAAA=="
  },
  "/images/blog/2026-07-21-curl-from-zero/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRn4AAABXRUJQVlA4IHIAAACQAwCdASoYAA4APt1apkyopSOiMAgBEBuJaQAAW+Hq8fsGDjMAAP7vvkyRu4Ii3zVAUQuBhkP7cxR7orKblK6a+orrAc7cOBOM6takIiy9OEPOn/D+Uj3CIXbs8Zz8cyUszXAmvQTrzTvpCPpMjtewAAA="
  },
  "/images/blog/2026-07-21-nextjs-deploy-pitfalls/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRkwAAABXRUJQVlA4IEAAAACQAwCdASoYAA4APt1apkyopSOiMAgBEBuJaWVuADc14dJHe0igAP7vSpSzVP7kESZW4pkB5/lVRMt6d+H6AAAA"
  },
  "/images/blog/2026-07-21-nginx-from-zero/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAAAQBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwDA3CG/f125VlDrkA16wAD+1C67/nz6beRpJrgViaUI3sUhrG0HZ+DjCqOadh7okZAbMk6oVoe4l7QAAA=="
  },
  "/images/blog/2026-07-22-ai-agent-12-principles/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQDImC0B5mIAAP7uzYgaRvl9589WB1MgZ7SZRGEpdyKnW+dWnqwonG0WEDrbPr1mq8BwSRDRuotO9Uig/AAA"
  },
  "/images/blog/2026-07-27-vibe-coding-terminology/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACQAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZ12AV5kTjb5hogfyAP7txuJuaefYhAFhVwoz1tTUL1j5UCijgCVZRZpe/WMEdGAXtxUO5bAAAA=="
  },
  "/images/blog/2026-07-29-hermes-multi-profile-replication/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAAAQBACdASoYAA4APt1cp0yopSOiMAgBEBuJZwC+SCKUgr5Xi7O+NM+WAAD+54W5jOwjWE/a03AgxWoVHZxTga2rMPTtjjj1uRfcdRq4Gj1az1Hnwaw8tIAA"
  },
  "/images/blog/2026-07-29-hermes-multi-profile-streaming-practice/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAACwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZwDImCHf5bYDE/UBAAD+5xqMDnjAmkhWePFPl/e6kDTj4AfaorN+eAFXQAAA"
  },
  "/images/blog/2026-07-30-feishu-image-generation-fixed-workflow/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAACwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQDG9CHfpP2bK71RYAD+5yghPNuF8oHMdHAXWJcJUHDIuqxV1FU+tnAKSK1HS+xG2iWBdrCAAA=="
  },
  "/images/blog/2026-08-13-ai-era-seo-survival-guide/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnQAAABXRUJQVlA4IGgAAAAQBACdASoYAA4APt1cpkyopSOiMAgBEBuJaQDImBKgP/SSl4N9n8UUgAD9D+UDaFhkCon+jLGUMcCu4uBS2V6BwZEZ4fvcwESMEpr57chjhr7R8VYBrfb19iYblZeDZkAnMb4cc0wAAA=="
  },
  "/images/blog/2026-08-22-ai-teaching-system-design/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmQAAABXRUJQVlA4IFgAAADwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQDLLCICg5Y5xrTa4aiAAP7tVk10UA9AOtz8l6vp3y8Q4CCQkeImR6ljIdVxiur/EkWC4DCxdDAQYlSCAgAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-aspect-ratio/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADwAwCdASoYAA4APt1ep00opSOiMAgBEBuJZwAAXKOqdBp11XRDcvLwAP7x3lpvAslFG63Kp2+Dle3y4lV2Q5YR/0t/S88q7rRShFbLL/NjUBE2f1gAAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-camera-angle/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmIAAABXRUJQVlA4IFYAAADQAwCdASoYAA4APt1qqU4opqQiMAgBEBuJaQAUYAI4P2LGj0ApFgAA/sU8qcV1kPOPyECr3a5I/ST432inXxlr04zxHWDA/lA/1IP6InFIcuc1pvQAAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-camera-angle/eye-level-neon-rain.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRuoAAABXRUJQVlA4IN4AAACwBQCdASoYABIAPt1kqU+opaOiKAqpEBuJYwCpD1/OIC0OzC3hEq05FHPj/GOW3Ac/RJdZWAAA/k+ntsO5ei1qa9DiGeEdBRUcE0Rw3pWpESP8NWJl4p4Mcrpn3A8zCor0xZctbYlJeZmuLQ6iVXdbnt3elFuGoCkhLzW9NcQPZnAxYZO5v/NSnmn4+BiK4Udc1KIS6b3zi8SLnUzdDpB4G05X2KPflDFlbj3duLlcGn0EEZYjTtw3BLkuEbsBPId9nbtO6IyMquk0Ee8Kd8XUidwjm5RccXrCA74jQAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-camera-angle/high-angle-neon-rain.png": {
    "width": 1023,
    "height": 1537,
    "blurDataURL": "data:image/webp;base64,UklGRuAAAABXRUJQVlA4INQAAAAwBgCdASoYACUAPs1MpUynpCQiNVv8APAZiUAYmzEuhVZIKpiCh3riTud7V+XNWkoy8+TadXMkur8AAP7168DYK2cJTjwwFiONGMNVEJDCIJHECWaQzauaIXkPqDLGRmvWzpIAyo7I3dWnP6+M2jqwRlX/lUwlq1vsZXX2il2XdGgQNRT+W/gMbHFaoyA2hYTcQF/7em3rg9KNHAOEQp8g3t9zS0wC3HCqARwRAUSz9bd2W/wxI7UnJV3nPBO9jus4hT8vi/1jZ1PXZ6t2Z9i/T+gAAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-camera-angle/low-angle-neon-rain.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRvwAAABXRUJQVlA4IPAAAACQBQCdASoYABIAPt1mq1EopSOiqAgBEBuJQBOmZknMFUAmIBtpvwcaQzJjq6e5k/hoySQ+cAD+703E3Bheb6pQTHThXcqZZMuLPsYoXhVXq4Z/RvTHxnc71Yf5lpaOXla/mnbBB4APEDAD5e5D8xyq/O6EuQnbQjaFXFtOWLBEpd4dBhrA10lf0grPEV7sIOdNTNCVvSsFUWae0t1LXpFD44oify0N9IGAxcHLtkyQ5SnANP1BXS9r0HEIyC4b/xBL3phLmcSeYijRB7QyTE8KCNL/lnrrOobWKlX7Dr+zwgfCDWt9ueoSlkEtKTEAAAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-lens/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAACQAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQC+SB2IpHwihokAAP7f9We2TBYUnIoxfQPvlbKlVjsnNgQyxsfg+j8jQsSxOg83523rd5tsNgAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-lighting-variables/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAABQBACdASoYAA4APt1eqU2opSQiMAgBEBuJZwC+SCHfj8h+VtCjrbUMPWCAAP7tWCpa5Bebzue1Az6MT13zSra8jr0sUEqlPi2+Tw1eSGbhpp0xEEXVEaG8biLbo4msPjOr4N0rJTVnAAAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-material-variables/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAADwAwCdASoYAA4APt1ep00opSOiMAgBEBuJZwDCgCHhFb4KujHV6WQwAP7vvoq1tWEYY/QpXWNK6oY2b84mF0vK/IzVUb98FlnArrGqDrOgMiCOFQEKDEkSGIXWdT5JGnmXOqMMjSGvW5D0DCVU0AQA"
  },
  "/images/blog/2026-08-23-ai-image-generation-mindset/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAABQBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwC2yBut//gGeWx26yzHvvagAOAzwoqlvJ5g9Q+qE7Ayx/6bS1i1dYkn1OJoAb9Rwxq77/wMyhB3fh+G19ObDBNMC9eQgEnADasAAAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-mood-variables/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlYAAABXRUJQVlA4IEoAAACwAwCdASoYAA4APt1gp00opaOiMAgBEBuJaQAAW+pgg6XHviHUQAD+774ib0vmKovRkTBY1m/tdy48R27Hg5xboUjX5P7wgY4AAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-print-color-management/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAACQAwCdASoYAA4APt1epkyopSOiMAgBEBuJZwABHuovUsKmnECAAP77LF3C8fTT/11W/9Xn79RQyBjftEfFDo3Ntb3udPpwjJbdqLz5yTWut08uTw4dOrVgbpjZK4/xAAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/close-up-neon-rain.png": {
    "width": 1023,
    "height": 1537,
    "blurDataURL": "data:image/webp;base64,UklGRoQBAABXRUJQVlA4IHgBAACwBwCdASoYACUAPt1WpEyopCOiNVgIARAbiWYAnTMWffED+gCWclABFHBAKqaExmT9IfbrG3kQjIzDMiyh2tQTsX2f1rUAAP7pc/dqj0fOrN1wu4y1oZ2K5AShH78iKLO5ZWDfSF+JUiSSIvl9l0IPV5mcpkFdNUXUUdwvrD6fgFNA+2mflI4f3BGpb4gKtZfGo5087/Pimg8MSSuX8+gRlQMO74LUfYORXN5QZ2W074XPYTTb8wsVU5kEq+fh1oGfE1vZ/BKLmkOobrEBCEsUnQMPX2J4ot+dgo0dsu4lLfE0ef2DlutoqtVXtrkdPJgL2knywJUcWa90V8/Gnn151nKaoIuIXMUy6iEE1QROo6ZvyJYMzCR9SzD732BgBl4+GLXVy0g87o7koQlJqi5BK5fQJOnDL+7QheKcP9eLd4BCwxeR3DEv9e7Z5gi8WDkHd1H1lqR1JcOAThVooW+Xh8V+botLZjxyd2KVtztJRCPfz4NaQAAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAACwAwCdASoYAA4ALqVut1ujKKioiICkSzgF2AIcd7r92Mkqj05gAAD+9PUrN3W4yPBwZpQVIdNhFGgjv7sqXtoxX68tWn6ZHzCUmXt/MbqPcWd7paE7pnjTLVapb/3SfP2jry2AAAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/extreme-close-up-neon-rain.png": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRgwBAABXRUJQVlA4IAABAAAwBgCdASoYACAAPt1cpkyopSOiMAgBEBuJaACdMznG+mABXwPvHKMJeBMnmlm68/rrhMfaA+re1LkYAP7qSuztnm46pI9HVgDYlA7ygBBm8x9I5FA8Au4AHH3Cowts6ZX1OnbQLp3/sHLrvjy2r/nMlQw7nnGr9tjxKKiyJlZ/cuzfVJH++aMHQLwpelZL+ohzk0jE4PUHJbN/n/FN/FjuVFSV5YdAQWJRfSffZUuNnISU8jXiHlpDRwVqVhEe6SPSU6yeVjReIMVvOQbJnM2BVAer3FooMWlsSYBsi8fU9WAp01s7ZRwHKGZIa1XkptceSJvSMswwrVEmWPTzeAAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/extreme-wide-neon-rain.png": {
    "width": 1672,
    "height": 941,
    "blurDataURL": "data:image/webp;base64,UklGRroAAABXRUJQVlA4IK4AAABwBACdASoYAA4APt1apkyopSOiMAgBEBuJbACdMoR2WCnKEvr2O1sAsE2XMAD+3dU1JwEalzZT89UeZjU1I+kghJl0Q7/T4v97scFbfaJnBRCPKSw/QrZu5vOox5tSMZ0WWCOsc94LgFJiAwekZh27kqj8/BfzORiepyt2QshLE0Zp+57DUWFOoHwFtI17Zh5rPXgSAiGgpYIl61tq0n1ebIbkJmKREBR2D7iAAAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/full-shot-neon-rain.png": {
    "width": 1672,
    "height": 941,
    "blurDataURL": "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAACQBACdASoYAA4APt1apkyopSOiMAgBEBuJZgC7LwAccAiS+doI/k8CdLTL3wAA/vRTCOVrwOCLA0AWwTnQyJ6Cb9g82KQ/ZncINPYf0J60xKDzAlQHsawsubLcU2w0zFb0U2Hj9XiufcnX3+CBZFMzLiVpt0+uRcwk/l5Hfuv4DwT7Srf/9l+/G8QT3h0J5Gn+iSHMgAA="
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/medium-shot-alloy-wheel.png": {
    "width": 1254,
    "height": 1254,
    "blurDataURL": "data:image/webp;base64,UklGRsIAAABXRUJQVlA4ILYAAABQBQCdASoYABgAPt1ipk6opaMiKA1REBuJZACxDQSBhIPITMSSyrjAggqjo8/yVl6sssAA/vVqiqQ4apuxnSm6PvAFwDhEjJ+dH9AF0jWBw2IMzeDAp5mVwndRMS/buy4OkhIGUR/5fRuhvLWRNh/u3OwIyYyyVVgKKxEB4LWyifvAY4uxXGFd7RXCnkCgZ5yAt7zIFmI2jZxsHshAOdz4Jg2czA0/GLiggEoPXymOOEMuuBbAAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-shot-type/medium-shot-neon-rain.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRuYAAABXRUJQVlA4INoAAAAwBgCdASoYABIAPt1kp1AopaMiqAqpEBuJQBbfXpHmOLK0YzeqZCb9GVm4s/wMWrE8jdP8Dkkqv4RgAP7yp2rbCsmC/JI+eN0TrjOLfWA0vCSnlmBnGXWe2hpp9s3ZG6SZREKZn/wWXRvMG6Q0P/zRBXApolUI3ASCPu4XwVvhxjZb7gTM2kNKax/5JsSP9ePZ4AJFkpetCcNNh0JhcUYsvJ325N597XoxMRJaKmGj+UcykGUhcdDTU0fxWpT1jsO+uN6pSmBEc4t7wenR731cgYEn1zzN2oAAAA=="
  },
  "/images/blog/2026-08-23-ai-image-generation-style-variables/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnYAAABXRUJQVlA4IGoAAAAQBACdASoYAA4APt1qqU4opqQiMAgBEBuJZwAWIAMRDgld3YYUejywQAD+sjRJHHWMmUJiD2Sjs9YszPHX+768muqgWDfY2Z1M4WYcUVAYDdnmG99zO/154kZIIbnaJdNjzVhUYDMkhgAA"
  },
  "/images/blog/2026-08-23-ai-image-generation-visual-variable-formula/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlIAAABXRUJQVlA4IEYAAAAwAwCdASoYAA4APt1cpkyopSOiMAgBEBuJZwAAW++XpYUAAP7vzqIXi1CY66FmvjHSnn67JV2P+ucwPKiSwTWsq1wrAAAA"
  },
  "/images/blog/2026-08-23-crm-sales-assistant-feishu/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAwBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwC/OCIj/AMUo5TvhbrbRwAA/u2NgRw0vJGrYVriLY4u3O+X8yZbOgifuW4vfT24xLnh/TcoZVZEeoiHZF01XMmf2sxrz0LifkLP5is5Jmnz9834AhvEzTAAAA=="
  },
  "/images/blog/2026-08-23-doubao-video-pipeline/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAAAQBACdASoYAA4APt1gqU2opaQiMAgBEBuJZwDG9GlpSim1AtRk2e47QAD++yyc99IpK39HmUevuVBsZpfN/91RUDJSJSFmYH/7vJV+1q/Wx25W5iDW9FJ/xfWFJK0N2iaL5IGcFOR52YtC6kAAAA=="
  },
  "/images/blog/2026-08-23-douyin-cover-skill/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQBACdASoYAA4APt1cp0yopSOiMAgBEBuJZwDE2CHgVor/6BPF+g2bxaWAAP7zdPnw4PE0ezCex9fWZVmjwTyNhD1Flu6imtpWK6CIxBWnuCeaK4irwoSGNTJjyHTq3+j7GNDHAwtC/HAAAAA="
  },
  "/images/blog/2026-08-23-geoflow-content-production-pipeline/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoYAA4APt1qqU4opqQiMAgBEBuJZwDE2CHpRHlvYSQoZQwIAP7qjL4Gotjmu/hpvYMRQmnSUvKETW8sh8PdymdZGtkqmR7NJ0RGSAAA"
  },
  "/images/blog/2026-08-23-hermes-streaming-cards-feishu/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwAwCdASoYAA4APt1ep00opSOiMAgBEBuJZwDCgCHhh2e2BYiqgAD+79AM/M8JPMZU9Tr6ZCUVNEdQFXUIqQOMBrEWAZ1n9nxqL01Z4jH24sN1HL5ZAaXQ5rWXvkdivOAAAA=="
  },
  "/images/blog/2026-08-23-xiaohongshu-graphic-pipeline/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAADQAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwDImCHfiUDe3sBAsyAA/u/CUayg/57+1LuWFGu/MGslDEtzDb8RPeQQAA=="
  },
  "/images/blog/2026-08-24-page-by-page-reading/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRoAAAABXRUJQVlA4IHQAAAAQBACdASoYAA4APt1cp0yopSOiMAgBEBuJaQC+SCFU6gVK7/9kCPRVXAD+6nw7mBeK78gmfpMuj8ECBkqW3aLggTnPPm/zHd/kr1PVJNs4+DbuWvLWCkGMVRPVRqPBOcrZMhRfH6uGZ32lxvLokCT2C8tIAA=="
  },
  "/images/blog/2026-09-10-ai-knowledge-base-matching/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAABQAwCdASoYAA4APt1apkyopSOiMAgBEBuJZw3EoAIwCeXqYAD+79eN/kELh4//VcWr8zjMUG2XCgv3zeDpiXRbKu3qm126RZMeaT1vFbhPaYy9tZVxWaOcVZv9nwuK9ER+VyIq/PTEA2gAAAA="
  },
  "/images/blog/2026-09-15-diagram-design-skill-engineering/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlAAAABXRUJQVlA4IEQAAACwAwCdASoYAA4APt1ep00opSOiMAgBEBuJaQDMHCHgZwr5UUZgQAD+78JMWmHHNALTs3dFBy91ZRS4OVb9UNbE0FeAAA=="
  },
  "/images/blog/2026-09-15-hypit-video-compiler-agent-skill/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRpQAAABXRUJQVlA4IIgAAAAwBACdASoYAA4APt1iqUyopiQiMAgBEBuJZwCw7GZHKoobOjOPQikLgAAA/vQIgCkgEX4faab8yQYqEUdv9mZUL3pSyJnpZTe3qcjdWsrxWVqH4s128uU8wmGJhap7BiDS3QKXdcllPZIg505f3rTKFaikO2XmdKO7SAfxuMoFFosYUl7o9YAA"
  },
  "/images/blog/2026-09-15-xialingguo-ip-cover-skill/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAABQAwCdASoYAA4APt1cpkyopSOiMAgBEBuJaQDLLC0H1ZNYAAD+77eMPenr8nUu9WdfuJkvapCHLsie+It+rx9bfAkszs/YlgNRjesr5ZiwAA=="
  },
  "/images/blog/2026-09-16-agent-skills-catalog-evals/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRl4AAABXRUJQVlA4IFIAAADwAwCdASoYAA4APt1cp0yopSOiMAgBEBuJaQAAW+uXhruYtMu3Bi0AAP7TSDF+2DGFRTWoECN+Fy59ichVFhPf6x7uMrcgiN9r+g6OMsxqwAAA"
  },
  "/images/blog/2026-09-16-strix-pentest-closure-discipline/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRkgAAABXRUJQVlA4IDwAAABQAwCdASoYAA4APt1apkyopSOiMAgBEBuJZwAAidpsPw6MYAD+7gKoJPyp5A+K6bckBphjlozi38PIAAA="
  },
  "/images/blog/2026-09-17-cwebp-batch-image-conversion/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRnoAAABXRUJQVlA4IG4AAADwAwCdASoYAA4APt1ep00opSOiMAgBEBuJaQAAW2M+CFl/yzIf8/YAAP7fTH/Q9M5KtAPizsN47suFYiTpyea4d9x5XDuY86mjEpBQEZA5Kuad/zuH/FbVrkmuIMojLrJiUoSwQLQ4gjBltgAAAA=="
  },
  "/images/blog/2026-09-17-yichen-skills-source-available/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAAAwBACdASoYAA4APt1apkyopSOiMAgBEBuJZwAOcEzjkcHyzxf5WJUmSzwA/usl6sbDI5dBD/Ddv/eAYbz9VO+MPBMmlOXm6FsaOgcQp59NJfbnSdwBUjfwlUnu1vVNnD3gzx0oLBxehujGU/wAjRF00mvulF8LVcoVnvFYAAA="
  },
  "/images/blog/2026-09-21-json-render-generative-ui-architecture/architecture-infographic.webp": {
    "width": 1264,
    "height": 848,
    "blurDataURL": "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAAAQBQCdASoYABEAPt1aqU8opKOiMBgIARAbiWMAzCGvk7fBXauaip+SmrK2r27KB74AAP7zgTc/RXqYz7967BJfYNsTOnNR+BODRQOfFDnR5iI0dVg79JhjUqJsDyuDInyt/PIoqyeZuOkD82lSM9ooBc9IjcHzPsNzP8V/Kruw3lEa2QKWdg6/jInwKqAA"
  },
  "/images/blog/2026-09-21-json-render-generative-ui-architecture/cover.webp": {
    "width": 1600,
    "height": 900,
    "blurDataURL": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAACQAwCdASoYAA4APt1apkyopSOiMAgBEBuJaQDE2CG7wrTYozHAAP7qddnvUoUKRKw9v0SLrCRxeJTTvPYN0fj8p79OsWp7em/0EXJA/rJaquf3biQcHoX2AAA="
  }
};

/** 拿不到元数据时返回 undefined —— 调用方据此退回无占位行为。 */
export function getImageMeta(src: string): ImageMeta | undefined {
  return IMAGE_MANIFEST[src];
}
