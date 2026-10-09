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
  "/gallery/2026-10-09-automotive-film-infographic-style-reference-vehicle-coating.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRlgBAABXRUJQVlA4IEwBAAAwBwCdASoYACAAPt1apUyopSOiMAgBEBuJYgDA/BmJ/ngDLKYAaVxnoYKzL5Fa6nLIGySyouURH8kQ88vsI1sxtoAA/f8rvWQX2tqfEjeQxu8V2RfZ6fyphYz+OQ4IyzQd2v5WIJRiVvk6P0oR9N5AMn77L0Ngt01Tiqy58gWDzlP2n7KLxGUntdl4k9pZhYIbOgs4llp7jIubVrMv6JxR7xH/GnYYqfPnsaOlM1KHXWAmxE8+jg6idsVP0rdXL/KQ+1Ja0NmpR1tFiIv9R+mNU/1xtpgdil8c0FcHks22XhPEOyCpKVO5J5B2f6cUuU9qxXsgEFPe+v4q2yLPONn1xtTRsNt8bvCjiuIef3WGmEW4RiDYnKbU4Gvp7Cy7kWI5O+ERoDrsnEDLw2p/r7RxyGG3ghthrSyl2U4oHtlrJi4CyjKlsQsodCQAAA=="
  },
  "/gallery/2026-10-09-automotive-film-infographic-style.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRmQBAABXRUJQVlA4IFgBAAAQBwCdASoYACAAPt1apUyopSOiMAgBEBuJQBOmUGauIWtsA8ATQEqB7mUHD285UqUEP+XEcrGDppXB/Un2kS8qAAD+auoENmlveiB2iFN+1j8mEX1a23N3FTYechVxj69Ku9FzbiRuJluRWIQUN1MFQPEjQh/SrJ0+9YO5ma90Em3aSE5AIB3E0U36CUv9NCmfKJe6QtX+JZJgud5+dfCKbNUMQ3B+Oe7DHFUeXtHNezhJU3/rJC3iE6qNkcMDEZavX4HWePSPuL5qh5j3fKAHJutee85ds6LX1e02JbOhtS0qdBT883gqUtDyld07Dw3kEHqmHFBiEbpzBooz0E/kaoXYnRt6+XeWtsJf2h7dM3/0Sn/kBQIbBbY7Db7unTRs1AH9fwG6RNMLbQNWUa1Qu06R/HXxWm5VhuS8o8tZMzDD1jPAw9zPfuhKwHb43d5tzpYExpAAAA=="
  },
  "/gallery/2026-10-09-blue-haired-maid-closeup.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRjABAABXRUJQVlA4ICQBAADQBQCdASoYACAAPt1iqk8opSOiKAqpEBuJQBdkJ3VKxt4Xg/CzsdVfuSM1tyW5s3GJWm1tGUnAAP7ql2OzsNtOr9bHtONBkUUmTlrnek06YzrkWthtO8qaF/NNgpUtQ0h/WnIJoR8o1W/PDl565739jd5UvlwejtwIX6R0Bv2lsChr7T+djrdC26f6z40/Tw4rLoLqfFzwAEafjA8LqcVmAe+DYLH3UTvL/kndcmIim1yOegCpIxhlGf00Fp4ByrncMfLzGO6Hx7eVBGRsKKkZaUt7PIPY4Qtv/eznVLJZrzfQvPHCUpCKdOg4LC3OkpWZ3mBopjgjgdpRksF+6d3ttkkg3LK5Oym4oWyasM75a7FGQ12VWi+1bQMBe9PXcB+HlgAA"
  },
  "/gallery/2026-10-09-blue-haired-maid-reference.png": {
    "width": 335,
    "height": 597,
    "blurDataURL": "data:image/webp;base64,UklGRiQBAABXRUJQVlA4IBgBAACwBgCdASoYACsAPt1ipk8opaMiKrgMARAbiWMAyy8sE5SMX5Uicd3/jAbNay+vMygMw2n0WlCfywmNNN8AAAD+9w4OOTr4C91sMxHol9T3BZ2bGP3loZDnvPdnFJZUJEuZZkdtem/1EeOh3ck+VptSi9m9WEiTa8be/pzqizirL2mppzusaJ71XTAPKeWzD1Zg4D4RiwZ4P1onhYlDrLNjto9Pg5qI6ttXS7ArkRUq5CcObuzIIDEBhX8mlJqbbCZk36WoHss5L9haSdAzAvCrlVo+XqIvJqHmVKCrC1YgTgBqndks7lfjZvfj+F5jmZA8TXHSMI552PDQ89JfI4sLAMf76M8U+8YIoT9AR6/uI3hcPIH5Z0AA"
  },
  "/gallery/2026-10-09-empress-cosplay-convention-portrait.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRoIBAABXRUJQVlA4IHYBAACQBwCdASoYACsAPt1mqlCopaOiqrgIARAbiUAVJPfWJncKfyqpAFn9XLD0KLZRWsul4WbY4kkobUhwJR45hQxWaqQ/ngAA+RInOymupPY4j0FtRgOis/hs/IU4Djx3OUsB8XcYoYh3WNqa3hlUH1musVvnJQxbxXvhXI6KNT8MSBS6oiaKBEtHO+CYTwsHNoX4B3Yu2IUGXoD64hagKoIIpwin1H/8CLmVy6ZxhlT9H1cwbIMw+KDXYp0wk9SB8LAUXXYObpTQ8gjvLhIdFbVlIJ4tBBaIgFqXXe8nNaJ6TbhhlFCny9AXuHKSdB0SJ1640xU11glnLHLk8ae9ZbMiERJ34rNWYoFcqQVsCaAGbXzpjlPt9ydchn0F4TyROzAsDY/EPN+mWod2sI0NMF0Yxp+QPMgviQxe8n2EgN+B+l/Xng+FVvt3RlcfQfhUmrFStkAkidVexSHyKao+BHTZjgQXLqro8uTGyUGmdP2xQIUkjiqQAA=="
  },
  "/gallery/2026-10-09-ev-suv-wheel-replacement-original-vehicle.webp": {
    "width": 1440,
    "height": 1080,
    "blurDataURL": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAACwBACdASoYABIAPt1iq08opaQiKAqpEBuJZwC2yBEkXWdAdXov52BS08HiIjfoAP3jWvOiMtHGqLbiNP5pdwn+gxowqtVlqqkwcdm2t1T8GF/YGtcy2vPOJs7J+gPj2svjwL8w6k2nhplIhw++nKRdHzihJCin8Y/nN3YWnJZ6eeE6ovritkFPgwaUpGEZYxGuEBJZCwAAAA=="
  },
  "/gallery/2026-10-09-ev-suv-wheel-replacement-wheel-reference.webp": {
    "width": 1440,
    "height": 1080,
    "blurDataURL": "data:image/webp;base64,UklGRrYAAABXRUJQVlA4IKoAAABQBQCdASoYABIAPt1mq1EopSOiqAgBEBuJZwAFEz7wB/s0Qrp5cpn1Y0DvsqJZdnp5Y8AA/vV4/vVP8+f0+3TBcg/7lM8XBUjAgmaiz0POHPre2sgi3JyyuBvFAKMdjq568RZqzxEGBX9A3bQ7yhopP1U+uW2/P++AjIuBo5rzih3Lc2Vyv1Ho6yndkrvCCPAkFmm8Do4Wbqlm+GcnQRTUyd0+/dKRWAAAAA=="
  },
  "/gallery/2026-10-09-ev-suv-wheel-replacement.webp": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAADwBACdASoYABIAPt1iq08opaOiKAqpEBuJZQCuHYyAZDhp8gnPhygqz2hUqR9uO6AA4DQWvcTcGml5+j2rQ42AvTPesaVjmQDkCUvveLVmaGZxDz1OhKPDapjSW3fBeUDirNOmaPi383gX3JTVq/UlomZOWDUwRBBsh8mv1qEmkymiHtsnBWFfVlMqwiptmov5VBvaxTav/YbtOldtOTqsgDAAAA=="
  },
  "/gallery/2026-10-09-korean-indoor-natural-light-portrait.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRiQBAABXRUJQVlA4IBgBAADQBgCdASoYACsAPt1ep00opSOiKrgN+RAbiUAXZf/gO+s7WxRl97RCysoO1S5e3IrLrrdt5WMp435ADDcm/dwA/pZS1fSh5OJQzurpVaVR0ZElRpDS0/b9rYQA2l5ODGkFjGdXt/BiZz/JD5f7/SOxuDeliZwCA42DriVxWOIAmsPU1CN7uAf3O59hydToj9+fuLdBq0DGvaBxqhbpZCwSBjRVBg8mmLPm5VFIsQPc6gTsTmTsBMAQmLpCFc+SxFA2Vlhk0AjCvpTBM6xVsRWakedPcpO5Dn/O9w0kw/hdzFEGkYU+iEBnC+E/yUQTN7Y1Gkd6IpEyYLs2XRb2gmllW0NSl8SNWZQAtYJ98aGSwCNyL4enogAA"
  },
  "/gallery/2026-10-09-logo-removal-local-inpainting-reference-1.webp": {
    "width": 1536,
    "height": 1024,
    "blurDataURL": "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAAAwBACdASoYABAAPt1apkyopSOiMAgBEBuJaQAD5mINeOYK7sxn1vU6GOgA/u/IRcScNiasLgqxLh4kWPc8DTlQ9Y6NEkapPb2WYnxLH7FKyS5Dz5K4F4KYKHisqqr2/QNTS6Ss8ic1OOjxHt/54qviYmvp31oO9aGRG2ynoVYLfOznyhDRS8GxHPrbclG/qcniseVlig/oV86nAAA="
  },
  "/gallery/2026-10-09-logo-removal-local-inpainting-reference-2.webp": {
    "width": 2048,
    "height": 1365,
    "blurDataURL": "data:image/webp;base64,UklGRqQAAABXRUJQVlA4IJgAAABwBACdASoYABAAPt1apkyopSOiMAgBEBuJZwAD40oOBPujh/DhxpDoudxrAAD+78lX/8NKtqy7RZWVq5wUKSvM7gkxMKtmxFn8mnXsyeiIfOdJ2PpaSd60WhNALCr5LnLQagEv8+SK+fzbADbutS37DzCm6R6thxl3vU/YnrPOu8/rfmozC5NufAzc28IpkuvIjPc9zxIoAA=="
  },
  "/gallery/2026-10-09-logo-removal-local-inpainting.webp": {
    "width": 2048,
    "height": 1365,
    "blurDataURL": "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABwBACdASoYABAAPt1ep00opSOiMAgBEBuJZwAAXokOWOqxqo88eN/ODMouAAD+yrMu7CU4cS9L/HyBPynQZlkqnxKOfV6KZyjGSs2ZxiGGax1mzqzL/v0v1gQtuybbrARWOzb1dpK8j4BYxYS/eYe49n01uj3Gajzr0Ltlam4WFOWJ9vX7WOZSjgH4AAAA"
  },
  "/gallery/2026-10-09-porsche-red-wrap-preview-color-reference.webp": {
    "width": 1212,
    "height": 1616,
    "blurDataURL": "data:image/webp;base64,UklGRu4AAABXRUJQVlA4WAoAAAAQAAAAFwAAHwAAQUxQSB0AAAABFyAQSPJHXGaNiAgHIgESTnLSnUbtEf1PJ1OcAABWUDggqgAAANAEAJ0BKhgAIAA+3WSnUCiloyKoCqkQG4lkAL5LLAB3lSWOXVGxN6dVXnybyiwAAP68gFFOeHbZH7YFOGEjirSwidpCakwo+TJuS6u4DcEd/JSrHh5RJyajXaVU/PtX8Sgt6219tik5QUh8Q0rlTkjYjru4BgbvKTvU3HOQUCwCzkvCRp3Qc8c22FuXLmNwRxC5uJnVlQsgha6rANW/dMLX9qRrLY3PYAAA"
  },
  "/gallery/2026-10-09-porsche-red-wrap-preview.webp": {
    "width": 1320,
    "height": 1147,
    "blurDataURL": "data:image/webp;base64,UklGRqIAAABXRUJQVlA4IJYAAADwBACdASoYABUAPt1ip06opaMiKA1REBuJZADGfBENSpZLFzJlk7ob1whRQmv3cAAA/uleoDprj/utSFEE+dw3DmkPSf4EuChszXmQAA5XoOfYWB1QNgvD7LSFcSwW4CDomj/qYQcDKQlCmNOnOlkWLkGm51tnw4X/lAhShL8Ie+bHE/NkndGcgUA4J0McveNGcIMAAAA="
  },
  "/gallery/2026-10-09-tengwang-pavilion-morning-poster-brand.webp": {
    "width": 2048,
    "height": 359,
    "blurDataURL": "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAACQAwCdASoYAAUAPt1cpkyopSOiMAgBEBuJYwC7ACHnn/vm3QroAP7s4NhhYp4+JnUEz8F7+j8WlEMdV/fUuKdwbJEDa9E9ZBksBROi3taAEWHG4AA="
  },
  "/gallery/2026-10-09-tengwang-pavilion-morning-poster-qr-1.webp": {
    "width": 174,
    "height": 126,
    "blurDataURL": "data:image/webp;base64,UklGRogAAABXRUJQVlA4IHwAAADQAwCdASoYABIAPt1mq1EopSOiqAgBEBuJZwC/7Yr6cLUtfE+gHmgA/u/RUd3yN7bD+RRbjLekWrSzEMGXb21c5Fuicd4opr7syW+wVNonwW9aTkburVo2dYFKPIottS9ssRgG/U/9oosBL0dk70nUPwTV6ACrOC0LAAAA"
  },
  "/gallery/2026-10-09-tengwang-pavilion-morning-poster-qr-2.webp": {
    "width": 258,
    "height": 258,
    "blurDataURL": "data:image/webp;base64,UklGRlIBAABXRUJQVlA4IEYBAADwBgCdASoYABgAPt1mqlEopSOiqAgBEBuJaQDPp3gLabYrcgQyPxL/THsABWs1TuhnXQIK3/NVxify9EH+XuWAAP7YZ+1Tdrk7Yeh4gsXB7ZxiDvaHXJ9pCDCbmVicfiOtjrKAJXq+S/BXeW64E3xwXR9WBrDZtHzm2gWBPFe5Fx1PeURWVwwXJfIGXlWOt/Aqyr/rbvWwdjpn67SUYbPR/SQAC+qTgASB48mtvyELKmzKu6OlLA2uGznYNJzpN3wi7iBiLYvSHHQaN8S97GQD2tR/P/JHBwRWePw2DlO+ZiGAjQvurxJ4R+syD8xe0N/P6xZCw7ElT6/r1AUfACWn4/V3tDRPY73nYngdiW4LprtZ+zZ6efJYpdjA5G5U4MaxSPTFVn+v52VqNMfkoB2xmzg75ZPMa4Ufdgq7HvuAn3q/oAAAAA=="
  },
  "/gallery/2026-10-09-tengwang-pavilion-morning-poster-vehicle.webp": {
    "width": 259,
    "height": 194,
    "blurDataURL": "data:image/webp;base64,UklGRpoAAABXRUJQVlA4II4AAABwBACdASoYABIAPt1eqU4opKOiMBgIARAbiWkAA+RRBv/MGOSpyNNtILX3AAD+9MuRg9Dh80jhh5P8rcR5TDe/d6riF0nZ9vXvk92Xo6AeHoZpCALq92bY96tYFcnytZNzR9246TZnIvjniltepW/cWDFUl7/n6E+NyI8FA6X0Lh5Y4rWVIZIv+W40GAAA"
  },
  "/gallery/2026-10-09-tengwang-pavilion-morning-poster.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRnQBAABXRUJQVlA4IGgBAABQBwCdASoYACsAPt1orVEopaQipWmZEBuJagCdM0KEetZ/vm6BjL5DwCbMSTdRmFDNz4h7yDkVoYyt00Eh+KB1uLtEAOGkL1JLByUA/gREabmyjOSIG3ukTcu+ZJHSvuq00EzHiJrXK9QbSFheC6NNI8drxbW5N9imY6etFrMnqnNDUD4icl6r09vcAHVbEd9ga6Kp1GJGa0mCSNMiR6j/Jhg4mLR6exM0tR3Nd1O6zZ0vK65FrneAfRjsmOjqa/yNcb5fpCBGmxZOtCGINAiAXkX2+uKRlvc330CESxQ450yFj3jy9bUqv488NR8JmI8kL4V6ivlYdirdsDeUgCOI0QsVJM9mvkAHuFEEbQr2iyZioJDxwaq5+0rwAoYwRC+Kuc4ewveLZCRGugFiA/nJnOF/cOZoxpZwlK6VtmEz6+1EcXv7oQzANKmD0hgtIWwyvQx9HfwvD4JZnwfQ1EOjdg2/iXAAAAA="
  },
  "/gallery/2026-10-09-underbody-protection-white-background-original.webp": {
    "width": 1920,
    "height": 1080,
    "blurDataURL": "data:image/webp;base64,UklGRpYAAABXRUJQVlA4IIoAAAAQBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwDE2CHez63rwuKA97EgAAD33CNAeLFVCsY41+RA+DOAnltgaVR5GiwDbmvUcVdD3R9f76l/rhjqEbBnBzZmuOyOEwGB8I0CHipl2uRKSph2ne9phSgjOu+XccbdBo1JVjW0NolKiyr7I7Xst8OAAAA="
  },
  "/gallery/2026-10-09-underbody-protection-white-background.webp": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRp4AAABXRUJQVlA4IJIAAAAwBACdASoYABIAPt1aqE6opKOiMBgIARAbiWkAA+YxAxnc/0me0Qo6wAAA/vOanAt/p3dRXsFr7fxNKI3Y/N343h0jCEoWfhClqhiFbM9TS+ePYawncnKbJxGNZEcmCOl529P8xka80G1P6ofsfGmdgFlJ/lyCGStSaqfqdQbHjM2dUsJQOgjRAcxr3Bz80gAAAA=="
  },
  "/gallery/2026-10-09-xiaomi-su7-laser-sea-blue-wrap-preview-original-vehicle.webp": {
    "width": 547,
    "height": 365,
    "blurDataURL": "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAABwBACdASoYABEAPt1irE8opaQjKAqpEBuJZwCsAAui3+J/p4yiePTkexDrwAD9h3X7KYKPNQKrUgLqMYAyVjLVzUuJztnPrkYh+fgP+Prw3DfH2dg+XxnCF3k3A8t3uWV5+XfUhVUxhD9MiHp5pHlIV/T3wl5avQTlvBTQ8J2+FP3DVZzmFRrM1JD4IU8TXJKMTV+qkjQ1QFsIAAA="
  },
  "/gallery/2026-10-09-xiaomi-su7-laser-sea-blue-wrap-preview-swatch.webp": {
    "width": 864,
    "height": 1536,
    "blurDataURL": "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAADwBQCdASoYACsAPt1ep06opKMiKrgMARAbiWMAyJgISUbbohNsQrAu5jpHhaCUjpLvUV9dH3XgAAD+QgakJt0mlJDZJbNb6ePJ3zEhMilm2EbDYngFt9Iyaf+8NaSUDqhte9JuUgKdi/IhfWstARJExQf2U3dgRn7RAmsVSOyiCLJhhRU4sFDzqVpb2yc4BVE+4BigV4TSYu8OAAA="
  },
  "/gallery/2026-10-09-xiaomi-su7-laser-sea-blue-wrap-preview.webp": {
    "width": 1536,
    "height": 1024,
    "blurDataURL": "data:image/webp;base64,UklGRqgAAABXRUJQVlA4IJwAAABQBACdASoYABAAPt1apkyopSOiMAgBEBuJYwC7MjcAkxzfwuc685EJyceAAP2S45y1vuM8xfgLkjG8bIoZhvLZE/px1OW9IBDwGqvU0Y7TcTMNp8zG+APOiGmAq6GrF/3mTIbkB4KZnv8BQqOQRTfpEHOMBN9qN146bMsm5CQiEN6MfDiYlqNPZqXQYqkMSrKUZpxBdTBX8BFQAAA="
  },
  "/gallery/2026-10-09-xiaopeng-m03-underbody-protection-car.webp": {
    "width": 299,
    "height": 168,
    "blurDataURL": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAAAwBACdASoYAA4APt1gp00opaOiMAgBEBuJZwAD45IOAOn7MSZetWIwgAAA/vTL+kDMeV1I5rwR1D3R0JOrC94H2H9cWkBarVb194z3L24MJorBv9UHR28nKf/r8dC3tXSnWOAA"
  },
  "/gallery/2026-10-09-xiaopeng-m03-underbody-protection-logo.webp": {
    "width": 386,
    "height": 118,
    "blurDataURL": "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAABQAwCdASoYAAgAPt1cp0yopSOiMAgBEBuJaQDE2BYFnRt3AACrOG9mMCuUMCqrUStf3tk27DpDRPWBPq6ToEWD7J4sYXOowvlGR5ugAAA="
  },
  "/gallery/2026-10-09-xiaopeng-m03-underbody-protection-parts.webp": {
    "width": 768,
    "height": 1378,
    "blurDataURL": "data:image/webp;base64,UklGRi4BAABXRUJQVlA4ICIBAADQBwCdASoYACwAPtVapUyoJSOiMBqtUQAaiWcAVIX/6mfkhoZJ8bTeNHN/1kE0RdUp8I60PdlkMoZdWMoJhhvlnYxodjG+gAD+7XWrdXcCGNEsK9bEbcI8h7xAimPYxrbV6D/JVQuEDIZDG9QlDPeNuXxnjRg6ixPsk8sQNiov+94Oy011SUyhOjngWwGp9YFLJO+CM0ftJPDwEY+GiVpgzhNKNhbT67RigLS0YVIezfsP/TQP1fW6qQVc1AmaBIVyAQ3SaaWIt73aQ2tb//Q2ClqsxEOTW611SBTG95pJvfvY3Z/XE8QDqDNkiavu8TBJf/QkZyCryS09tiQV659DiDU4e6mtR3YkFR6azEGRAl83WEIiYC9GJgZDKWXergAAAA=="
  },
  "/gallery/2026-10-09-xiaopeng-m03-underbody-protection.webp": {
    "width": 1254,
    "height": 1254,
    "blurDataURL": "data:image/webp;base64,UklGRjQBAABXRUJQVlA4ICgBAADwBQCdASoYABgAPt1mq1EopSOiqAgBEBuJYwCsAywTkwX8eMW18g8XvnBflpYc2Nn+jqnzWQKfIAD+4leaBBe/KH4UQmsXuGikcl3npsPd/ADPc+yl/k81mZCCGZ/BBAXFlp2M/NvipFWQZKN1ZNDW6QSSeIPQqs+hkOoBXdih7CB5mC7m0oObL+t7lNx1qDG6c9McuEG0jmgHrDMR5YoOZNfFobXyU8to6eli4kMByb68jCU/vQQauymUEhwwaImaihDzthUJNNZ/nvkjyo6H/Q/kvc19TUw1XShAD+7CswM0Qj1R7W2Jv5wdNO8cKiPyTU/of1jEkFLIK3irM7U3/DXEcm5d2HTOdPnNtKazh+y00iChPj6CD7ICRim8eqHG6rmsIwAAAA=="
  },
  "/gallery/2026-10-10-lanhui-v1-au01-inner-brow-raised.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRv4AAABXRUJQVlA4IPIAAADQBQCdASoYACAAPt1iq08opaQiKAqpEBuJZAC4PiAByimbf491DXOGzLomBQRnGrxeRDZrpAoAAP7zeVZd7xnhlPqRY4ff1+6yrPqdE6/Yqjg44EqQU8D3dOkbvr6ZalJqpDHiR1ugzPg1AsxnaGXMjdnm36LiBOaYNDa//lR9hEseMJH5gEvf3jvR8spxIyXjnfQdK8vnL7UAOYAIG5i266fkzfaR5XLhPJo1BUkmXwHaK64/4mvMu+8MxjZ4uqsp9L0szqsOEspZmjVRu8G8byYP5i+bL6dzEC78RQpY6lb+S1DtjbJ6fVXWOz6ZZAAAAA=="
  },
  "/gallery/2026-10-10-lanhui-v1-technician-headlamp-base.webp": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRu4AAABXRUJQVlA4IOIAAABwBQCdASoYAB4APt1eqU6opSOiMBgIARAbiWQAxNmLBVm2JvE+DqjiwqcbCqHvJ60IwPAAAP7xxOx04N4wxRHg4LHpH6z19oWal69OBFTFG186dx5Rs+3lu2cdz2OEpcdEM3UM7mCaj8upj59HL9kgMTFyjVNvKd6VNR/RauoavOTB+fqqqiIA+ZaXgO3G6z8I08ROrHVK3TcaGQOoV0+br8h/ru5JUUXgSSkPYDFCXkTaOA3Cmgrbu0c+8pwggXu48FPslhzAAzYtCWZgfgwQcW9iMzvKbbi2zEkIQdgSAAAA"
  },
  "/gallery/2026-10-10-ppf-xiaohui-character-reference.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRv4AAABXRUJQVlA4IPIAAADQBQCdASoYACAAPt1iq08opaQiKAqpEBuJZAC4PiAByimbf491DXOGzLomBQRnGrxeRDZrpAoAAP7zeVZd7xnhlPqRY4ff1+6yrPqdE6/Yqjg44EqQU8D3dOkbvr6ZalJqpDHiR1ugzPg1AsxnaGXMjdnm36LiBOaYNDa//lR9hEseMJH5gEvf3jvR8spxIyXjnfQdK8vnL7UAOYAIG5i266fkzfaR5XLhPJo1BUkmXwHaK64/4mvMu+8MxjZ4uqsp9L0szqsOEspZmjVRu8G8byYP5i+bL6dzEC78RQpY6lb+S1DtjbJ6fVXWOz6ZZAAAAA=="
  },
  "/gallery/2026-10-10-ppf-xiaohui-img2-history-origin.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRjwBAABXRUJQVlA4IDABAABwBgCdASoYACAAPt1cpUyopSOiMAgBEBuJYwAIFfYA9gYxtoJu1s87nyfqgXujbXBYTDuZHk6VGqOfM8AA/f0+spOcS1VOwlIUxsDxkKFNC1mNZ9DEYfTCpwXUSBKwCW77Y3e71c+xGpiNwiQw2ZLvaqoWA0r9yhRiGFr3M2JgX4IT6L5BMegCtTXtVhunqBlv7MhAO1VqrMn3JDJnlubRElBLnUaLlJOlrOPVymbmtXy9iysn4AwmHT6xA0CkQmYb3QOqaeM9uRrhn4deuRjL1hvDNQkzb32W8w1oz9Id2sPIFvvsYBqLbWJEOI8Mn1iDCtc+s840m4giWyruRnPP6lx3+CNfr6iH70Q8qK7jYWCvzaEjL6dson4B4cj1V1VqL8mWoR8MNbRDwsxdsAAA"
  },
  "/gallery/2026-10-10-ppf-xiaohui-img3-structure-principle.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRlIBAABXRUJQVlA4IEYBAAAwBwCdASoYACAAPt1cpkyopSOiMAgBEBuJQBdmUGXYEv5+PTAFACOzmnSDv1iTGhY6RLz3RDvNoXvOaeHuCoavg/gA/slSUjpf+bg1wz195/rve5pbQlSovWktsm5hmtBuqYZOTMJmAdterJl8kDFwbc/Y1lKKi+EUEGRo6Ysm/fah9iDU5sKXk0TcTthAf/cnL4xgxAQZjqD9V7+LCV/7ulqiC1nxtEvAN2jB+Rk5JSrBPA2VW8n6+Cjgqju339S+3ImRCSK4GfmvkExfbwxndWyXbld5Wv51DqL89EjLq3HaCDLDF0BxZdhWPz3iO2WdiAtziscUSxE7VWlxaCpoLK0vWDYGfjF9O9bwCnI6OTXdJl6QBNa9opYIzujC4Ah0zzmj5cs+QMohuRnx3kNLtnZdbhChYtQpsix4MNm73SE/MIAAAA=="
  },
  "/gallery/2026-10-10-ppf-xiaohui-img4-comparison-decision.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRnQBAABXRUJQVlA4IGgBAACQBwCdASoYACAAPt1apkyopSOiMAgBEBuJaACdMoM6LItz4umAby2vwVy3uSezDt4GdRGBrH8ctDEp6BAAqQMXiFPaWgAA/uHeLsegNzF0NCKG7ufpFSQ+hIVlSAxlPJRCZ/S+gnT+bdKaIddeoMdKwLnXs98wINZuV4Be3C8ry+wsFYc/LbQQ34pPD1wEYmNxAt8rTh6dqRmyquJ75dzPugFoqArMBCWW3XSwzD6fe8uF7sEZX/Fyn6/pg3/UXkqvykwRdlIEv8e6MXhaUdnb0/gw/z0clA9JuDj2b+X/ZgsEXUJwY8g/ZZLZlRe6VDkJcWbGrUZ6ro4ELgt2sMraE1nBQLy07z9TPxYMeaDHU48WZehzS0aBi/tmHwVL0G1zE08RqqB52KSeEldWsayOBXAAePaD2GH7VarWL6fdJURGS9kv7zalV7RgRqJMj+LhUP9+1sRU0NpXnXr6pTz9qgNq+rQAAAA="
  },
  "/gallery/2026-10-10-ppf-xiaohui-img5-faq-pitfalls.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRlYBAABXRUJQVlA4IEoBAADwBgCdASoYACAAPtVYpEyoJSOiMAwBABqJQBOmYc5Rof7b/boDdmuYDLj7dTf425JUhNeBMlTCQ7OAWxQ8Sq7AAP63nhr72Tgz2a6yNMPS1rUldvqJ+lbWwBkUMB+JycoaNa+nF84tS737GmoPajhYrI/EPdk3+er2QOvdpMehyoTxsJSl4HXesuzijLQ4M0iuP5uTXjmqNiB9rIPunEIQ+ik/BbsKVNbut8hGOoxXH/lpR3hfZd7RZX+s5y7JYLYbXaYAlrKqdu4Cc4bx7UTG1O4jDsJuJGhZN2bbu/Sd7k258AaSGRjTR+078NM9AFszwpNFb3usKa45cHzBxx4sKXkFuIIG924rytZJsY6bEYVpi/5YNPA+2MnwbS6sne1k/ybRPGh5fONu3KYHCLbgVEZR+e2oo40N0r9JQv63XPW8R/boJMOuAAA="
  },
  "/gallery/2026-10-10-ppf-xiaohui-mg1-cover-hook.webp": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRpABAABXRUJQVlA4IIQBAABQCACdASoYACAAPt1apUyopSOiMAgBEBuJbACdOUFUvinSAZirkgG8er8FaDLA0mrNIy/Wb/cOwDNvemkHdq6rE+5KzpY5RCaxnAAA/vOJxIOZLIh5n3L5jaOhjLAii5VhhF7FdyGB7hbu2l4VlkQiBtsUcXAC/En7vclqQod9eegucNhwkMsBj/sWxPURB3HsrUiqxLumzyLuy3qwpe4Jy+k1tC+ojFwY8xLF1nT8Y4rwhzBalgpEEFyRf0w0MyAU5v782ZHZd4R+lWLjSN1v2tyEvnESvum7UJWuXScUPawSLVUWnvmM94gKUQqbTKOxSfNS8ClJNMF1aR+Bhnr/4U9Nh+XGUWrCnjxp7kc+fyTSN+74d/BcPeTy3zWVKTvXpqPpojIFKmXpTQ9THcl1k6a266+YtWXiTH8utBbZn3+eMTdQ+9xbZlDyfLikVqfWzG9hQtRQDjRiFxeROr6Qjh9x4o8vjhuxDgC+vdfrY4OTKUReq+mlTQ+G1ssS+HIyiAAA"
  },
  "/gallery/2026-10-10-s03-six-gears-beat-a-wheel-upgrade.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRrgBAABXRUJQVlA4IKwBAABQCACdASoYACsAPt1gpE4opaMiKqwBEBuJagCdMv64KsccANNmzWIarfbIgrFhgo0U6IvZnJ4J+SscyyJuJ82DNQDJkzTaNxBbGEAA/uoxKJVpfVow7+n8odNfu8r0Yrj0jgdHQmte59Eqcc77BZU/CffBYytV422HOVYDkZQjUoO50H7F6mfAKsAnfKrMfxSoDrW3/J8QckHjgn1ldFYVvp8SdFX/hWCQd7/iDGmi4FI/HOIvLnlU7x75nywonuzMYewW8zI49DyYngUW2n7ISGfkXRPCSqMwQ1tIhgPO7nipF7VVNC6oQyUj7EojsOsc3aIffA+ktV5ixnSvHumnffnZ4FovzN7ZC0Vr8/EioGpMBdCagJOyEoUO2bXwwgWYKJuJlKSd9sFqMXLxLidrklmlwZTfXOkky+47LhvMPpaFg0+Azj97hEOaDYapw6Kk9HIwVfEGmwPI6eOcTpodFTezr8WtAvcWuCC36/rjn5WnhDDPj7s0Jq73N7PO8tvYTaOBFc0DPB9UdPLGLLZZ8lpNEOhJPIRKkIiEfIDbpjA/dTbrZG5ziAwAAA=="
  },
  "/gallery/2026-10-10-s03-six-gears-beat-b-underbody-protection.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRvQBAABXRUJQVlA4IOgBAABQCQCdASoYACsAPt1ip06opaMiKqoBEBuJZACdM2PIqCYqTz3lj/17QdhrMMCdJ2ziEYfigwxzKiGqIjogGImC6VpfaoyA4phHaSxJsvpz2sCGAAD+3dVusMjoA1+fk3/GRmZKNc/30oysdkDCl9V8ylobMvja4xZDgHJHdgNviNtY9HxfiSMyTNJEV710lx2S68nOF/Ddr1DyXkeS+dU1W+1Dr/W11zf3piElO0wfoj9Gju+bW/4B0ZBUqhjJLX1qL+g9O+rBfltI48pZzGJwTzmYUTrfuYW5Rd3LMtfz2kwY/7n4wQmptxEe/p5fG7y9yvd8qLXJUL2HWU5bMasDcTsHevudrps4f9C98soRt6q98IU+EOyX2uwN4vGN739/LkTfvy/dtZEwFt3nZQBK/q170V8ViQV9Ct7QdGCnwZhduYKZs1bIFUzNf9Otx+AE7uO6sl+9MGNMNLYfQsR/rOdzHar2xS5U9fRsh+AAI48cmQMmeDPt7pv+31+bqAhrPYxCNyxXmfJs5pOP6CX2aOCI7gdjHMyFJr82RXHjJXFKGmMoKNaYcJbsqgBFIbaAd/WYJ2nn59WpyC6vYJvS8y/nKn9P7CfGVGSjJ1mIpgFRIGyxDu3LWu0yIqZbchgQqbwPcRQAAA=="
  },
  "/gallery/2026-10-10-s03-six-gears-beat-c-power-step.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRpgBAABXRUJQVlA4IIwBAAAwCACdASoYACsAPt1epk6opKMiKqoBEBuJQBfPbq3YFa54DTYDtyzAdckVeM4zFwPl1eP79uubXltVzRu+E32FBFY77JFW/SmwQAD+8y/P3HM15JTE4oLVFns1HqlZlnsy3+TkPBONfHIiEsn6uANHUnqLcsLD9p0k+HlSF77jPbm86jzWNfR5Cu/NhzW98tpU8AzCRT65Luu5slbLwwWhEsIa+6QdKKJo8SZp+DIMFQHo9G5+Z9aVZwdbLFDuMMwpFDauzMsQdzixBOkSxLBNW7W6hh02IvI5ISFgj4i3xaLpGLkCPJYc2O8dcMn25SIIlpYQ8Jj9mE2wHnbPvVyRAi+RN98Jm6nGtTeyNMmK83STZ5VsMHfIvnWZa3RRdxb9jYqEG3yfolaQtKcceAtQgmj6MUDF0P/YeJGDUjn6EMgh1szdVYJw6s6qa1E+oat45flm9vHzIxgLOLdTJZeTD+gak6jSpC3QCuwSZSbbm5nalobHajMcioO+1RvmxBUzH92PM4Nqm2LL6AA="
  },
  "/gallery/2026-10-10-s03-six-gears-beat-d-window-film.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRmgBAABXRUJQVlA4IFwBAADQBwCdASoYACsAPt1Yqk4opKQiMBVaqRAbiWQAsSVA39aCAKEIDGVfFDFYkUJOtPGmEZUkvIF/7AmjFcjE38VJNnN/8RIoAAD+wHWy2HKiMdXrkdqvPCweG73s0iOYtWMC2K+gHnYD3mMkByMPWgRNRKl3B3uw/q6KRwOOQ1NRgG6vstEoG3ozbhC+fkj2owv5+KXxTn/RUy3W3BqfF+taUsM17txgM/KejCetLb2yCbRH5ZHDyFntjdef39Wq7A1hWsZBTWK6vD4vPfA75pnJ7r3iCWZjxryrsnCeeqRJ/aUcEiuqFjt7UG9UqmzMbV5yDvA0Ti7AIUJqJq6SwsiJkBZeVTOSUtUmyxj3sRzbX9GFZJX3bA+AgHW8fugvcbIx2LMeYZbNaRZsDc0xkSMZ1fkEy/MBWcl7eGXX/sRxcsk2sVkk9PIsblce6i1gDXISnueosQJ75u8AAAA="
  },
  "/gallery/2026-10-10-s03-six-gears-beat-e-color-wrap.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRjQBAABXRUJQVlA4ICgBAABQBgCdASoYACsAPt1epU2opSMiKqwBEBuJQBTisYsNmrAxcq3W/+rA24/PAg/eFj9MIzZETJXmYJpgIAD+7EyvvYvdJfHJ0mZo17Gjz1Zea2hELu4AM7PBqCYwWrN08FwwZl1R8UJAlkeB87k+5W04iyb+i3PwzeJaV6+9ecpabFFB77E6myyQMaiS4aICMN4VtucIQINEMaA14w8z1IFENVFg+B9X+d8J7FvNZNeAqDOGKWLDBHDnKsdm86adKVgh9DJwtMYnYs5PRaLoonKqKsXSaL3pkNX3jA6TLo1NsCt5gXqDUoFW1HnkbKYuTzqfENBRCh9eha0oO6vJs5bZvp3Pue+egX0sGzH00xqDhkhG0uuioPtU1favyUH/QAUCVaaMCwAAAA=="
  },
  "/gallery/2026-10-10-s03-six-gears-beat-f-ppf.webp": {
    "width": 941,
    "height": 1672,
    "blurDataURL": "data:image/webp;base64,UklGRp4BAABXRUJQVlA4IJIBAAAwCACdASoYACsAPt1iqU+opSOiKqgBEBuJQBOmdNzlgAErl7wy0xzidsUPOdou3ObFOS8GLrfX6CX+aXYILaK0FzqjBKDziiFkeAD5E/1U7JT2lm+L7QdQu93EdM9zWrzLdWEofNisa+Y5CYyduPVeeEZUNL+VIY7Df8iYMo+d/M7EGu7ILHfJfnoRchUXPSLJr6t37sZ8NLPdfmOMB0F7ZfNhnpIX1/5aZxrN18wMeM5hyQFuweMdAXc6qP8R8rupLAVo8QUH6scUeQ0EDNYygk4OieatCqmrBVveLJvObxWnL8UgSTUEqYUyyJWu3fW84Wuqx0TzwW+z2uqJqwtIZKUqcf56dYcAAztaABTZfMVZ1uQJieqlqE7zlybkR/xjTDcUHIYw9PucZXMa4gRkvrqP5CgAUoSAGHb5Aluk10WpzfgtnzRhg8LSTMfDtXB4p/9vdBno00R6KfzEXMYJXI2CNb8Gq29KxmGc7pgWYyGf9wgkZJyn5BMwvwL2XdRgouDrd/tY1/85FW8y5rYAAAA="
  },
  "/gallery/2026-10-10-s03-six-gears-character-reference.webp": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRtYAAABXRUJQVlA4IMoAAABwBQCdASoYAB4APtVao0yoJSMiMAwBABqJYwDKAYxE32aZ1eFRoswmeiwJZGmGl4vbzK+AAP7qgex9dCVnwUbmkhAmnsV0n8lzkWrTx/oBgusgT8CJa2+eO3wZfRDnGXrOq+Z+p45wScGsgBBmGpqsT+F4lasoFxLh0wN8ZX7SfViAOLIEXXNK4rJIZPABA/t/cSaE8O9LsHdfoAna6voRPAiOXZWrWghbK9exW0yn9nrVPzWmiX7B8QqFm853MawC0UiExzmaAAAA"
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
  },
  "/images/blog/图片提示词/01-比例.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRrgAAABXRUJQVlA4IKwAAAAQBQCdASoYABIAPt1kq08opaOiKAqpEBuJZwDGQdbPZhjwsf1hwFG3Z68rB/BL1SXAAP7zgf/feSaQGE8MSEOrKeqELycnX3oJRKh2igiegV07plswgqMDaFxmkaWTdp3J4M+Sr5zA+QKF+xOAxarjPix0WEZbBaknqnziwr7wg90edLDuoS8xqQAtLOPHA/BIg4HmYr+mReeNh+LdZgOY+gTtutGQ+kdjZYoA"
  },
  "/images/blog/图片提示词/02-构图方式.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRvwAAABXRUJQVlA4IPAAAAAwBgCdASoYABIAPt1mq1EopSOiqAgBEBuJYwC1G2dB/TASoHvAGGYjU0Cp8j/9GgZ7b2AX5AsEuNogAP7wFucVvY/VWyTw1Fr8Cu9Arm9Az0dUtlBvC0QxP6envNr5uWRZZfrM8o9NfSWmt0IYt1wh8tjbaw7HdNvLW8T7jVyeY8QdGaAF/Fecalb6mBBQ2UryvI329z+uePwSAcWGOLdQ09NJfR1eSo8jgEtoOIO7CAPHihFyehf+/WigxAaWTyFilgtkaPwAF6emTUVxVitzeMIu9wL0e6ekXRTRBp1z68iWb6CQm9rdJkM0ddqgwAA="
  },
  "/images/blog/图片提示词/03-风格对比.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRgIBAABXRUJQVlA4IPYAAADwBQCdASoYABIAPt1mqlEopSOiqAgBEBuJZgC7Ef/jekcAhuSsz5Sb/pedESNPJKQTNGFlNk0NgAD+8fzl0KT8f4DB7NIvMw1JUZWDdLa1zSvOKhFQG4Ir+eHnjmD5vjQ+3YVXj+3jlQH5fg4FQ8FTZcVbiuaIxUiK0m6QOOUKabSTVBSM1TEo1SUMTofW+rHoo9X0Mi2F51zBzRJY4FAQGJmpegO/RUb2W/+ygdfaF2CMiIa0JfRQqUE1YJiXh8ap5ifxifljT6nS2JX0lhJWmJI3+0zfOAqyzLLfJkIGuUMUNiOKrZ+XcIhA/S2H8kZWHMqgAAA="
  },
  "/images/blog/图片提示词/04-镜头视角对比.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRgABAABXRUJQVlA4IPQAAACwBQCdASoYABIAPt1mrFEopSQiqAgBEBuJQBA8TsCPoCtHDpPrargroEujVifh1lMSc2ZksvQA/vOCuod5jPCA0fuZ4ILP/CeClZ8KNRzZn9bq8lqbNITTbHDHL7EZqbpbfyF2TRUMh++0Tq3RZKbBFInBK9skcsjQCl6OxDyGT2+9/p03uL0JNXiMUy6WDIyRO95r/tLi79NNf/C60/VdE4l+WEMezSrynr3aBAFgP9amB5fsRM1NnxBIjbWKT/7oP2UKFGo/2EJ0RpTPeSEyIDLiHuGlNzoD/hOtP+hld+nYIRPIOJmhFuxuN6Cn7r0AAAAA"
  },
  "/images/blog/图片提示词/05-光影对比图.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRrwAAABXRUJQVlA4ILAAAABwBACdASoYABIAPt1ipU6opaMiKA1REBuJZQAFEAFxiP2pJrzISDDLBJcmAAD+8fF/s4DnRVlOsZpvV+I7+2nHJ3cL/pQyFy059KgC4HJzXr1Tg8FvkReADqLMeX+navlc3o2XWlDOG3URHPDgXeftZPlr6AKOLmKJe8WDdmbPTQRcEAttvkrnNjmthyHZKfXr/zYHAuO0bfkCpuL9Y+sXuWaorkehPkZKuzqow60AAA=="
  },
  "/images/blog/图片提示词/06简单提示词vs完整的提示词.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRpwAAABXRUJQVlA4IJAAAACwBACdASoYABIAPt1mqE+opaOiKAqpEBuJaQDLaBBVJegW6dGHEd7r/1deO08oAP7wTGFKdTO/1z3zL7RdHdMrKbO82K3m/G/p1Rk3Fd+jDeZT+62qEdyQscGxRlKTRwLbtNHaHEeiozhImGt8VzLzOQJWvgwGumGmNQ7RgpaGEdDQKB/AvoOwGC7S7RQAAAA="
  },
  "/images/blog/图片提示词/07无约束和强约束.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRrAAAABXRUJQVlA4IKQAAAAQBACdASoYABIAPt1mq1CopSOiqAgBEBuJYwCzgA9+7DvunrhqOrHAAAD+8ExvOtVjvqwW7Z1Xew287w0TrNt+VNlBQB5A9rrx2Mo2onsPwPpBrcpMe8gEQKiGDtkM43132sST3jyAhHNrgv65QAzMBuLb1XC4ioIxIqquEL7ZUN1TBydkPfDa6+pM3rCasDr2BsvUu7iBHXEfXYYk/IQEhRMoAA=="
  },
  "/images/course/gpt-image-2/lesson12/01.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRkwBAABXRUJQVlA4IEABAADwBgCdASoYAB4APt1iqk+opSOiKAqpEBuJYwC/Sf/2P+WKyZ348XugcM/DYzhxIewuETaJBW3SH25YBFay+5kAAP7rsQWSeWaLHRpaIaRt0FBLHg6AzZR3i3p2c0lVThCpeFKBhQKvdi/4UWmlPowAZ8K7JpQlY2WO3wALpRpsEr7FPO4WO1iaEWw9atgKwN/35Wg5aagfw9SU5z/5TLA105DINV3O6+PjXaT6R257Tm9r06dxbvIx/yO3QbdV+yl8jk4sy7cLh1ccZQyX2Ur2a0WxVX4fu1+LY1nDcf8BNA1ZXteGm/mhgC/SCdZLj8d0GLL/RPqDCjcQgNtEjWdGtGq0dOgCrolBqn/ZQWaBDzdTcgP/WA5/5rYB3nYjl26HEEY1AmSVD49iigGnhS6xJeY6njyVQmg/Lsgv0gAAAA=="
  },
  "/images/course/gpt-image-2/lesson12/02.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRnQBAABXRUJQVlA4IGgBAAAwBwCdASoYAB4APt1apUyopSOiMAgBEBuJYgCsBAgdgQYErDGc+QE+6bFSp8Nw3l3IHmF9Izx7Eg7V9zL1nGUQAQAA/vBu64U43RvpDazNafhAuFvk8ispL6lqCqjLbGCXLSJrkNcD7BtRZ8X0GRWQcCkaihOkaoI95C+8HmOx6Skx/HNXvJeJweNB/SBAat/LN6q0sY6kop7QXHV+RlnqNz9GAcbUoq4cE7Z/5Jukso/bzsjux/aYSwmP4gx5KlVd9zTTKWbOHy7SK8YVOfOTIRmmznh9FPlYD14HpaUP39MU9HFU+YNr9phCNT5EDZrKFVgpzu8pXIK59MP2z5PXMWEblYLbFEhio+N52+OPgnAKCbCa4Ou4BhOXhQPe/lL3viTe5lTFr3LeN9GX1PjRHJjKqyZciIz02b/sSVNO0682B499snGQBwRNXq2dKpB1/qx8v9vSpEAt/G2bG0CJSmBPSdAgAAA="
  },
  "/images/course/gpt-image-2/lesson12/03.png": {
    "width": 1448,
    "height": 1086,
    "blurDataURL": "data:image/webp;base64,UklGRtQAAABXRUJQVlA4IMgAAAAQBQCdASoYABIAPt1kqU+opaOiKAqpEBuJZQCw7YuQZaHTMKms6ZQOy/uP31ZDh/AAAP7nrf+wLLu88bq7wJL/XH1R1VmyaP71Gm78mkOf5251a8rWZzfJKO15x5p3ZmD/9hLJqffBRhBwC5v1ZFdoq0xZEC47wnHDagVArXgETNSCFgO3F/bh7BNfjJ2GvkwD+NbWsZQ4ntFEFtGjM5pHqUAeIAFDZxEAoH8etea94k+niUodcnD94KuqHIAFd3FvqWKlqgAAAA=="
  },
  "/images/course/gpt-image-2/lesson12/04.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRoQBAABXRUJQVlA4IHgBAAAwBwCdASoYAB4APt1cpkyopSOiMAgBEBuJQBafP4EjL7w6wLflqAdJ4Td+Lb2R1ct39kh26r61K0RdSAg5A89e4AAA/uq1pvjwlXvJy8N2P3dgasBx6Ka/FRxAi16he0FOIhVS3qx2nnhYJAbtIFaTTy/su0U+WlXUz3XAp8kbGFgYln2oXV+7gsbTeyWhhGqso59A4T5n1AmKPGDgzJeTpF0ZKwx+DmUTqYYYyhohNEVz+3n9vGASDH6JvbDsZ/lOvUIbhuVA8ktDxFoRmCNTVOl6k2XhuEgDvboev2WFLGY6qABFs2+jju5klUBOwZnCMNnyvLN6g5dOQCeSPD2Gf6dfydONsz5ZalgdKfH/9OVHywz19ly0i7NHZtPGqF7t6emHY05YhGh/+Z/C2m4zLVkBcuIGrpgzxp/Id9CnRzVeC9cFDQlJ+wzojP17XNXFhavoW93wf7qzW78Vcc7Q/ZykY4Gh7EZenPxsmUBv3xsGgLUfAAAA"
  },
  "/images/course/gpt-image-2/lesson12/05.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRjgBAABXRUJQVlA4ICwBAADQBgCdASoYAB4APt1grE8opSSiKAqpEBuJQBajbOdFkAKqL3QvYA4W9QYmp8vdyao3iz3WG1H4+zXYwR0QyAAA/u3sdBM4LeRr8NqI2rt0l3blgDhKB7tpcUSxWxedNEB5JEp2jobTptDO6kF2k07xxrUHwZbmXWoZZJ2seiP9/Aqo/j6VFBCZhji8KK1QlsWFXUjpjF5xqTcXcwxCury0bAw/lifyoTwn/1/y3BVUdLQiK/dseBGQS63LbRb/eeJrAf9wlSlKF/fiOPsJBJgyRMvQDC76jX0OECN786Douk3ao4JTcGUCymrLcENfP8Pwy9+3Mw/1yMr6s9XoFu8pBXaRhYY/zKqI6NnK4v8smqyL2CayLr2lQHlTkA3sfQn7XAhoZkYkTJ6oAAA="
  },
  "/images/course/gpt-image-2/lesson12/06.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRlQBAABXRUJQVlA4IEgBAADQBgCdASoYAB4APt1eqE4opSOiMBgIARAbiWUAxwX/7bjN0GG1ZeB+eub4hnJ+cjc+fbjUQU20MzCFkKy/gUAA/u/1TZo1K4Vd7ANedOTRhxC4dJy4Akos2Ejn5hUGthtl8qOhLbL2HpeaTtlLDpiszcErrzkyhu7emDwqeCM/lq+1JBhyxzf3tAE4jCD2sfneito3BFA0fbTkuE7PZHhL+LBmFNPQoiz94Njg/4+4dMEYry4S9SowTxPa9cwzq8ACIYVXhRY8Hu3u2aTQh1T1BrN7SfTp7OBxY9SPx8jcB2m8r8Vw1p16DKugHU0oExItCT5jNzETFSqGhRlfeAcMHGZw+5NlH81oXX2wm4qdc4LUK8RLfGWelopDCo2U3TVUPNeL2kTQ6bluQOYVsDhRM8PTqzF1gVZy3wPk6m9epBZ9DTsKgAAA"
  },
  "/images/course/gpt-image-2/lesson12/07.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRloBAABXRUJQVlA4IE4BAACwBgCdASoYAB4APt1apkyopSOiMAgBEBuJYgCdMuu74TASrFuNQaCTnl5focctrQpo7u3eerHafIwlSIFDAAD+5/kyJvOexQWINyE9HC7En9PgRXMsuUxqJgThIMYnUEcxM9xxeOrFE4dLuETu5hBSW7vm8MGgT/ECPU2HnHxtmfks68ch6ezFrv4M8R7/3bPF236BJphHDHVSTWj7HNeAqfa2T+Bjv7g7DrGhRAwMewELB/6NpV/3O30Cwkl4FaOu7qKYo+Uh5eDVpg2lMWUnsdN2pfTdYkXrnkT5hlQZZ1DQTlz3O7WJ2h8iao9/MIup2qk7JE/7ISX7br1AnR2z4O/bo7wPda4kMBtr+3aHxEdh3v1Z3tfN+NwfzIeJSLspWmqSfjA9Cqx3uskRfKyA6qBWlEOz7vbESzL7e81N/vnNKT4ltSorur9ABAAA"
  },
  "/images/course/gpt-image-2/lesson12/08.png": {
    "width": 1122,
    "height": 1402,
    "blurDataURL": "data:image/webp;base64,UklGRkgBAABXRUJQVlA4IDwBAACQBgCdASoYAB4APt1kp02opiOiMBgIARAbiUAVgIEDsBrAt7QyL7/bKvdInEF/CRKuX6IIkHyHSRJE6EIAAP7zgmmtFoUw7IvC+eXUjygBjAc4tGIw9DrXvm9rwD56MVpAvXeY6Ixf1Oo3SCLjiPwDVZjURcvNcFfklblWGXce2TKPBsK5x1j3Pn+9Y6/DX2bl//2EZsSgv4mrYtCTXiJ7+BhzOtFqtk2YONvWov8TSvql92BzAPOd5To1+YhzSANWSgAtbLL2NnuQ/DzK5aUorJaXy3kk1fO5wn6NV/76FW7LigEIM1kR119NORveo3U4mCNXZpb7XDlsro1UL3ZNWpB5FTIl9yU1ht/rPxfV/7lUQtOPPN17IV7t/X3z9uZpQM2WqaIpZdB9wZ5pHrIjEb7NdCSQJV0uzUwA"
  },
  "/images/course/gpt-image-2/lesson13/02.jpeg": {
    "width": 1080,
    "height": 606,
    "blurDataURL": "data:image/webp;base64,UklGRnAAAABXRUJQVlA4IGQAAABQBACdASoYAA4APt1cpkyopSOiMAgBEBuJZwDE2Bb0dnU1PAdYPdkZ7tIAAM3NkU3g7jFeQDWQRBuBlGCfu147yizl/XVVNcPGA1xZeKVrvdocOVplfjMiY848NyznDTYgAAAA"
  },
  "/images/course/gpt-image-2/lesson13/03.jpeg": {
    "width": 800,
    "height": 450,
    "blurDataURL": "data:image/webp;base64,UklGRrQAAABXRUJQVlA4IKgAAACQBACdASoYAA4APt1apkyopSOiMAgBEBuJbACdMoR3ACn7EiHJknD1HZzAkcAA/rvWaz1DNEdCm7Yn9TI7RZBDpNZ1DVIN7iLhsRsf0/JSznadqsIAridiiTI3jHBpG3tvjN3492Zfove8Na4oqzfxyS+U1RY6lnsESFGDpacJW/UBtvFFHHZpSgkp6vniX7Xm0/vkpZdQeIH4zmWGWMf0uf/9mMcAAAA="
  },
  "/images/course/gpt-image-2/lesson13/04.jpeg": {
    "width": 2048,
    "height": 1360,
    "blurDataURL": "data:image/webp;base64,UklGRo4AAABXRUJQVlA4IIIAAADwAwCdASoYABAAPt1apkyopSOiMAgBEBuJYwCdAB9siYptFi2fzznAAP5klBS18pt7rBQ7N9OhugopdCtbF0djWG522EEB0icFg7jnikWl8TDlYk86P5W9X8blowqIM/YKCO9L+TRN5p5bDfBj43vhucgW091ejW9QNp6GIAh3yZAA"
  },
  "/images/course/gpt-image-2/lesson13/05-1.jpeg": {
    "width": 2048,
    "height": 1366,
    "blurDataURL": "data:image/webp;base64,UklGRngAAABXRUJQVlA4IGwAAACQBACdASoYABEAPt1cpUyopSOiMAgBEBuJZwDC+CLHoG/clTg9w5brYPxq/+AA/fy4zNV7IXqlCxNkXH2pW/JlIJUKDshRzEc2ZXvz2WOkRJ7a70FFIynsT9jHtDnNZDGFPTgXejxfihMD7AA="
  },
  "/images/course/gpt-image-2/lesson13/05-2.jpeg": {
    "width": 560,
    "height": 472,
    "blurDataURL": "data:image/webp;base64,UklGRtgAAABXRUJQVlA4IMwAAADwBQCdASoYABUAPt1orFEopaQiqAgBEBuJaACxHtB+4BSIk/5zAC3/uVqsFdnptF3wwikh5hdiAAD+r0N6fc6xFGE4pX5IYPGEbb3+V+HTKfqXQJnBxBw71NrPio4s3/JDq4Lb8/KbXrbL/FFfTfCFz9TAJ8Nk2ZefOiJp0N46lLKzjBUc+Snwlh6s67BB9dYoughMcRuhMW9XS5l7Ym/N7Vs1byxzeFjWHEPA7HTSr6RbFTNaUIPx+EpQvJ5H0AcyLCi39QEbqq9gAAA="
  },
  "/images/course/gpt-image-2/lesson13/05-3.jpeg": {
    "width": 3000,
    "height": 3000,
    "blurDataURL": "data:image/webp;base64,UklGRgoBAABXRUJQVlA4IP4AAABQBgCdASoYABgAPt1orVEopaQiqAgBEBuJagCdMoR1X03ijMjwAZrrRSwNeQoztF3YftPN7CPbQWyEAAD+7Ej9CjKMbG5c6QMb9Ja73Ox0UavFoDUNAosZHYhQTuNTntQhjHN2e+tQ/DRngCvGAHBHnozf8yoyTXrqueZLwzJCDcZdlIzF4hugZPXqUgPBWZAtWmmVq1XUoGVDFK2Kft5szaPYClsLwT0gEaYZugRJgd6CCD0q/uldD+mkGGRGaUd2Rsd/SRj4jhoqMvE9cyTRK8+fljsfTlRWc7yfosqiBfQyFOJIT3a3ijItqQRdoJh+5fBioigfKcR4eAAAAA=="
  },
  "/images/course/gpt-image-2/lesson13/07.jpeg": {
    "width": 1310,
    "height": 737,
    "blurDataURL": "data:image/webp;base64,UklGRoIAAABXRUJQVlA4IHYAAAAQBACdASoYAA4APt1cp00opSOiMAgBEBuJYwBUQoeh6uW8am3gkv+gAAD+8MqvZEWVdi4EK5bwut3FkubVim9M0y8ctpjoUcGsqJ+UDx9kW/vRjLLfV98/sloY4I97gJxbuX+CPpOPQlgBcvrfJ2YaPqREAAAA"
  },
  "/images/course/gpt-image-2/lesson13/08-1.jpeg": {
    "width": 800,
    "height": 448,
    "blurDataURL": "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAADQAwCdASoYAA4APt1ep00opSOiMAgBEBuJYwAAW+uPNcgnAnD6p3AA/vaC7X+eF16Xy096jCweCpHYAMQfnZZ1U3LnaitPN5+73wJrLVENsQcIjMsgXYIAAAA="
  },
  "/images/course/gpt-image-2/lesson13/08-2.jpeg": {
    "width": 2400,
    "height": 1600,
    "blurDataURL": "data:image/webp;base64,UklGRooAAABXRUJQVlA4IH4AAAAwBACdASoYABAAPt1cpkyopSOiMAgBEBuJZwC/OCHaht91pPsf/85CxcAA/lHfKF1UaceZbEQKISkgRz+U/+K8cc3R60xL1lRdbTwCRpM4Mp9QmdW+TX+uuPU9liZPmeNieI8A9X9UvLqxHz7aSEcMRvmY9o4er9gLbcoAAAA="
  },
  "/images/course/gpt-image-2/lesson13/09.jpeg": {
    "width": 2121,
    "height": 1414,
    "blurDataURL": "data:image/webp;base64,UklGRnwAAABXRUJQVlA4IHAAAADQAwCdASoYABAAPt1cpkyopSOiMAgBEBuJZACdIHADAor4M9PTbJAA/eKV0AdgGkcQqXD5jlHCwhaQAOKvbRFhqi3Lc7hxStWBTa3e7hkV3xudVb2XI7JvfMia3aIPAsLniDN6IEHCq5h+Ni0FEAAA"
  },
  "/images/course/gpt-image-2/lessonThree/01.png": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRkwBAABXRUJQVlA4IEABAADQBgCdASoYACAAPt1ep0yopSOiMAgBEBuJYwDG+rZBQErFbmUXSsAjGAocEtoLMmK19SkS6vQ4dLqxqBGis/gA/pOg0ivGNNn5TXwpync9++gQksCm5YN1ZnslwabjiXQBpGdV8pVw1UhdM3W8+OJrMVZvmpbgYrdVaI2POkmrxYP45FeW+TcIz1NsKg42uQ9PTbtrRTcJfdq9rW5mkWNTu5D/lUFzXQhJjVFYGjG+0K3xlrX+hw1d82mRU0kDrDC2D8g8ZSgPZsCwBjyMVHcSJKVMo/JwW6Fa7rjxYEp998Htgc4mdImSOS+tiijLmzeaSOMn1yTIioI4fIvfhFaGsu4M4nqD5OIbYMtboJ5Q6NgbvqfHpsPt9CncIe1v/Mr0hDrDG4s/I0RU5sHYOi7/s0GOeaQW6u1zNWR3QSgAAA=="
  },
  "/images/course/gpt-image-2/lessonThree/02.png": {
    "width": 1086,
    "height": 1448,
    "blurDataURL": "data:image/webp;base64,UklGRhYBAABXRUJQVlA4IAoBAADwBQCdASoYACAAPt1apUyopSOiMBgMARAbiWMAuwHcC38Kwqjl1SOtnkbe6+8n5Mt4eDacEohQuAD+3rXZj4okChiPyVSfN0/1e9B8mxa1at1lQ8ghaM/dlK20+F75g5pIJBGsJLh+7/xdVCxPpcn6i+e2UEetXXCA8NZfDi1g0CHnW0Zhih/FrAUaCVma7pguGQJjxrRiVVGnRlbZbP7FWSRwCD7l6iA5g5T5ratCc6R6OanWR14lA7/Zj8vBe/7xPbSdrqhnZkJJrwCMAo8/vM7XNZyspZlATh91edIkfQLy9fOgzdKj1ZA59H3y0+Jr9v/1wHrn64ls3vfOcPUcjFyHtRBH2eAAAA=="
  },
  "/images/course/gpt-image-2/lessonThree/03.png": {
    "width": 335,
    "height": 597,
    "blurDataURL": "data:image/webp;base64,UklGRiQBAABXRUJQVlA4IBgBAACwBgCdASoYACsAPt1ipk8opaMiKrgMARAbiWMAyy8sE5SMX5Uicd3/jAbNay+vMygMw2n0WlCfywmNNN8AAAD+9w4OOTr4C91sMxHol9T3BZ2bGP3loZDnvPdnFJZUJEuZZkdtem/1EeOh3ck+VptSi9m9WEiTa8be/pzqizirL2mppzusaJ71XTAPKeWzD1Zg4D4RiwZ4P1onhYlDrLNjto9Pg5qI6ttXS7ArkRUq5CcObuzIIDEBhX8mlJqbbCZk36WoHss5L9haSdAzAvCrlVo+XqIvJqHmVKCrC1YgTgBqndks7lfjZvfj+F5jmZA8TXHSMI552PDQ89JfI4sLAMf76M8U+8YIoT9AR6/uI3hcPIH5Z0AA"
  },
  "/images/course/gpt-image-2/lessonThree/04.png": {
    "width": 1254,
    "height": 1254,
    "blurDataURL": "data:image/webp;base64,UklGRiIBAABXRUJQVlA4IBYBAAAQBgCdASoYABgAPt1mq1EopSOiqAgBEBuJQBftXlDAazUN2zEFAEZgL31VLOQ3qTdqwPF/wXx3rgAAyfyBMF6NBLNScfigonfHKiMw1SeNmCGIZY++vgjciO01ruycER8TBam+TIodCCZ/Nq07IHPa1jDqPw06CkNBSSut8ClTPDg5tfZJZuzra691qpw5jLMdaX5gEOyoXYzlX53EjIFE936wlGcdInvMMEd9R8ZRGNNCIAoNFKoBhhQtRrt8lPZqGEd9ECGtmtd0gTsqFjdpL8FvSyH50HfXNDj5ZfGWgBFDExYn2HFmgLvjj0VaoyS76e8Qvr6ImmTuomg123Z+dY29of65S7vlPCMQNIiBQsOOUAAAAA=="
  }
};

/** 拿不到元数据时返回 undefined —— 调用方据此退回无占位行为。 */
export function getImageMeta(src: string): ImageMeta | undefined {
  return IMAGE_MANIFEST[src];
}
