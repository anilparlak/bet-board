declare module '*.module.css' {
  const classes: { readonly [className: string]: string };
  export default classes;
}

/* Plain stylesheets are imported for their side effect only. */
declare module '*.css';
