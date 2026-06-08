import type { SVGProps } from "react";

// SVG paths are sourced from icons0.dev's Carbon collection.
type IconProps = SVGProps<SVGSVGElement>;

function IconBase({ children, className, ...props }: IconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      height="1em"
      viewBox="0 0 32 32"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </svg>
  );
}

export function Icons0Blog(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M4 24h10v2H4zm0-6h10v2H4zm22-4H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h20a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2M6 6v6h20V6Zm20 22h-6a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2m-6-8v6h6v-6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Calendar(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M26 4h-4V2h-2v2h-8V2h-2v2H6a2.003 2.003 0 0 0-2 2v20a2.003 2.003 0 0 0 2 2h20a2.003 2.003 0 0 0 2-2V6a2.003 2.003 0 0 0-2-2M6 6h4v2h2V6h8v2h2V6h4v4H6Zm0 6h5v6H6Zm13 14h-6v-6h6Zm0-8h-6v-6h6Zm2 8v-6h5l.001 6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Portfolio(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M28 10h-6V6a2 2 0 0 0-2-2h-8a2 2 0 0 0-2 2v4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2V12a2 2 0 0 0-2-2M12 6h8v4h-8ZM4 26V12h24v14Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Profile(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M12 4a5 5 0 1 1-5 5a5 5 0 0 1 5-5m0-2a7 7 0 1 0 7 7a7 7 0 0 0-7-7m10 28h-2v-5a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v5H2v-5a7 7 0 0 1 7-7h6a7 7 0 0 1 7 7Zm0-26h10v2H22zm0 5h10v2H22zm0 5h7v2h-7z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Idea(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="M11 24h10v2H11zm2 4h6v2h-6zm3-26A10 10 0 0 0 6 12a9.19 9.19 0 0 0 3.46 7.62c1 .93 1.54 1.46 1.54 2.38h2c0-1.84-1.11-2.87-2.19-3.86A7.2 7.2 0 0 1 8 12a8 8 0 0 1 16 0a7.2 7.2 0 0 1-2.82 6.14c-1.07 1-2.18 2-2.18 3.86h2c0-.92.53-1.45 1.54-2.39A9.18 9.18 0 0 0 26 12A10 10 0 0 0 16 2"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Rocket(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="m7.288 23.292l7.997-7.997l1.414 1.414l-7.997 7.997z" fill="currentColor" />
      <path
        d="M17 30a1 1 0 0 1-.37-.07a1 1 0 0 1-.62-.79l-1-7l2-.28l.75 5.27L21 24.52V17a1 1 0 0 1 .29-.71l4.07-4.07A8.94 8.94 0 0 0 28 5.86V4h-1.86a8.94 8.94 0 0 0-6.36 2.64l-4.07 4.07A1 1 0 0 1 15 11H7.48l-2.61 3.26l5.27.75l-.28 2l-7-1a1 1 0 0 1-.79-.62a1 1 0 0 1 .15-1l4-5A1 1 0 0 1 7 9h7.59l3.77-3.78A10.92 10.92 0 0 1 26.14 2H28a2 2 0 0 1 2 2v1.86a10.92 10.92 0 0 1-3.22 7.78L23 17.41V25a1 1 0 0 1-.38.78l-5 4A1 1 0 0 1 17 30"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Notebook(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M19 10h7v2h-7zm0 5h7v2h-7zm0 5h7v2h-7z" fill="currentColor" />
      <path
        d="M28 5H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h24a2.003 2.003 0 0 0 2-2V7a2 2 0 0 0-2-2M4 7h11v18H4Zm13 18V7h11l.002 18Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0Document(props: IconProps) {
  return (
    <IconBase {...props}>
      <path
        d="m25.7 9.3l-7-7A.9.9 0 0 0 18 2H8a2.006 2.006 0 0 0-2 2v24a2.006 2.006 0 0 0 2 2h16a2.006 2.006 0 0 0 2-2V10a.9.9 0 0 0-.3-.7M18 4.4l5.6 5.6H18ZM24 28H8V4h8v6a2.006 2.006 0 0 0 2 2h6Z"
        fill="currentColor"
      />
    </IconBase>
  );
}

export function Icons0ArrowUpRight(props: IconProps) {
  return (
    <IconBase {...props}>
      <path d="M10 6v2h12.59L6 24.59L7.41 26L24 9.41V22h2V6z" fill="currentColor" />
    </IconBase>
  );
}
