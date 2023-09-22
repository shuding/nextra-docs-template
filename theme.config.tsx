import React from 'react';
import { useRouter } from 'next/router';
import { useConfig, DocsThemeConfig } from 'nextra-theme-docs';

const config: DocsThemeConfig = {
  head: () => {
    const { asPath, defaultLocale, locale } = useRouter();
    const { frontMatter } = useConfig();
    const url =
      'https://user-guide-ten.vercel.app/' +
      (defaultLocale === locale ? asPath : `/${locale}${asPath}`);

    return (
      <>
        <meta property="og:url" content={url} />
        <meta property="og:title" content={frontMatter.title} />
        <meta property="og:description" content={frontMatter.description} />
      </>
    );
  },
  logo: (
    <>
      <svg
        width="178"
        height="24"
        viewBox="0 0 178 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100.68 12.6049H89.2555V23.9675H100.68V12.6049Z"
          fill="#FE1D5B"
        />
        <path
          d="M89.2266 11.3816L100.651 11.3816V0.6399L89.2266 0.6399V11.3816Z"
          fill="#FE1D5B"
        />
        <path
          d="M76.4958 11.3816L87.9205 11.3816V0.6399L76.4958 0.6399V11.3816Z"
          fill="#FE1D5B"
        />
        <path
          d="M101.922 11.3626C101.922 5.09144 107.045 0 113.347 0V11.3626H101.922Z"
          fill="#FE1D5B"
        />
        <path
          d="M114.657 24L126.082 24L126.082 12.6374L114.657 12.6374L114.657 24Z"
          fill="#FE1D5B"
        />
        <path
          d="M101.922 23.9985L113.347 12.6049H101.922V23.9985Z"
          fill="#FE1D5B"
        />
        <path
          d="M126.107 11.3626C126.107 5.09144 120.984 0 114.682 0V11.3626H126.107Z"
          fill="#FE1D5B"
        />
        <path
          d="M152.992 11.3626C152.992 5.09144 158.114 0 164.417 0V11.3626H152.992Z"
          fill="#FE1D5B"
        />
        <path
          d="M152.992 12.6049L164.417 23.9985V12.6049H152.992Z"
          fill="#FE1D5B"
        />
        <path
          d="M177.146 23.9986C177.146 17.7274 172.023 12.636 165.721 12.636V23.9986H177.146Z"
          fill="#FE1D5B"
        />
        <path
          d="M151.533 12.6049C151.533 18.876 146.41 23.9675 140.108 23.9675V12.6049H151.533Z"
          fill="#FE1D5B"
        />
        <path
          d="M127.349 12.6049C127.349 18.876 132.471 23.9675 138.774 23.9675V12.6049H127.349Z"
          fill="#FE1D5B"
        />
        <path
          d="M133.061 11.3626C136.216 11.3626 138.774 8.81899 138.774 5.6813C138.774 2.5436 136.216 0 133.061 0C129.906 0 127.349 2.5436 127.349 5.6813C127.349 8.81899 129.906 11.3626 133.061 11.3626Z"
          fill="#FE1D5B"
        />
        <path
          d="M171.433 11.3626C174.588 11.3626 177.146 8.81899 177.146 5.6813C177.146 2.5436 174.588 0 171.433 0C168.279 0 165.721 2.5436 165.721 5.6813C165.721 8.81899 168.279 11.3626 171.433 11.3626Z"
          fill="#FE1D5B"
        />
        <path
          d="M87.9211 12.6049H84.9718V23.9675H87.9211V12.6049Z"
          fill="#FE1D5B"
        />
        <path
          d="M83.667 12.6049H80.7177V23.9675H83.667V12.6049Z"
          fill="#FE1D5B"
        />
        <path
          d="M79.4458 12.6049H76.4965V23.9675H79.4458V12.6049Z"
          fill="#FE1D5B"
        />
        <path d="M151.657 0H148.708V11.3626H151.657V0Z" fill="#FE1D5B" />
        <path d="M147.404 0H144.454V11.3626H147.404V0Z" fill="#FE1D5B" />
        <path d="M143.182 0H140.233V11.3626H143.182V0Z" fill="#FE1D5B" />
        <path
          d="M24.1841 11.3626C24.1841 5.09144 19.0616 0 12.7594 0V11.3626H24.1841Z"
          fill="#FE1D5B"
        />
        <path
          d="M24.1841 12.6041C24.1841 18.8753 19.0616 23.9667 12.7594 23.9667V12.6041H24.1841Z"
          fill="#FE1D5B"
        />
        <path
          d="M5.71235 11.3626C8.86719 11.3626 11.4247 8.81899 11.4247 5.6813C11.4247 2.5436 8.86719 0 5.71235 0C2.5575 0 0 2.5436 0 5.6813C0 8.81899 2.5575 11.3626 5.71235 11.3626Z"
          fill="#FE1D5B"
        />
        <path
          d="M11.425 12.6041H0.000335693V23.9667H11.425V12.6041Z"
          fill="#FE1D5B"
        />
        <path
          d="M75.1614 11.3626C75.1614 5.09144 70.039 0 63.7368 0V11.3626H75.1614Z"
          fill="#FE1D5B"
        />
        <path
          d="M75.1614 12.6041C75.1614 18.8753 70.039 23.9667 63.7368 23.9667V12.6041H75.1614Z"
          fill="#FE1D5B"
        />
        <path
          d="M50.9453 12.6041C50.9453 18.8753 56.0677 23.9667 62.3699 23.9667V12.6041H50.9453Z"
          fill="#FE1D5B"
        />
        <path
          d="M50.9453 11.3626C50.9453 5.09144 56.0677 0 62.3699 0V11.3626H50.9453Z"
          fill="#FE1D5B"
        />
        <path
          d="M49.6108 11.3626C49.6108 5.09144 44.4884 0 38.1862 0V11.3626H49.6108Z"
          fill="#FE1D5B"
        />
        <path
          d="M49.6108 23.9667L38.1862 12.6041H49.6108V23.9667Z"
          fill="#FE1D5B"
        />
        <path
          d="M25.4264 11.3626C25.4264 5.09144 30.5489 0 36.8511 0V11.3626H25.4264Z"
          fill="#FE1D5B"
        />
        <path
          d="M36.8817 12.6041H33.9324V23.9667H36.8817V12.6041Z"
          fill="#FE1D5B"
        />
        <path
          d="M32.6288 12.6041H29.6794V23.9667H32.6288V12.6041Z"
          fill="#FE1D5B"
        />
        <path
          d="M28.4068 12.6041H25.4575V23.9667H28.4068V12.6041Z"
          fill="#FE1D5B"
        />
      </svg>

      <span
        className="manofa-text"
        style={{ marginLeft: '.5em', fontWeight: 800 }}
      >
        User Guide
      </span>
    </>
  ),
  primaryHue: 337,
  faviconGlyph: '🏰',
  nextThemes: {
    defaultTheme: 'dark',
  },
  project: {
    link: 'https://github.com/HausDAO/',
  },
  chat: {
    link: 'https://discord.gg/daohaus',
  },
  docsRepositoryBase: 'https://github.com/HausDAO/',
  sidebar: {
    defaultMenuCollapseLevel: 1,
  },
  search: {
    placeholder: 'Search',
  },
  toc: {
    title: 'In This Chapter',
  },
  editLink: {
    text: 'Edit Page',
  },
  feedback: {
    content: 'Provide Feedback',
  },
  footer: {
    text: <span className="manofa-text">DAOhaus User Guide</span>,
  },
};

export default config;
