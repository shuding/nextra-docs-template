# Notes

## Typefaces

```css
@import url('https://use.typekit.net/pgp1osb.css');

font-family: Stolzl, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans,
  Helvetica Neue, sans-serif;

font-family: Manofa;
font-size: 69px;
font-weight: 300;
line-height: 76px;
letter-spacing: 0em;
text-align: center;

font-family: Manofa;
font-size: 90px;
font-weight: 300;
line-height: 99px;
letter-spacing: 0em;
text-align: center;
```

## Errors

```bash
error - ./styles/campfire.css
Global CSS cannot be imported from files other than your Custom <App>. Due to the Global nature of stylesheets, and to avoid conflicts, Please move all first-party global CSS imports to pages/_app.js. Or convert the import to Component-Level CSS (CSS Modules).
Read more: https://nextjs.org/docs/messages/css-global
Location: theme.tsx
```

Fixed by adding `_app.js`

## Resources

- [Custom Theme - Nextra](https://nextra.site/docs/custom-theme)
- [Global CSS Must Be in Your Custom `<App>`](https://nextjs.org/docs/messages/css-global)

## Call with JP on July 19

- [x] Glossary issue is resolved

`_app.js` is a wrapper around the entire app. It allows you to import styles.

### Theme

- `theme.tsx` overrides Netra
- Not using the Nextra page layout
- Is it possible to selectively override?

In Nextra theme they are pulling in the `"nextra-theme-docs": "workspace:*",` package

https://github.com/shuding/nextra/blob/main/examples/docs/package.json

### Just CSS

- Looks like it is using Tailwind
- Do not have classes to hook into
- Custom theme may be necessary to override Tailwind
