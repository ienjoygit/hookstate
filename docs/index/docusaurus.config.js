const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {  title: 'Hookstate',
  tagline: 'The most straightforward, extensible and incredibly fast state management that is based on React state hook',
  url: 'https://hookstate.js.org',
  baseUrl: '/',
  favicon: 'img/favicon-32.png',
  projectName: 'avkonst/hookstate', // Usually your repo name.
  themeConfig:
  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        disableSwitch: true,
      },
      algolia: {
        // analytics overview
        // https://www.algolia.com/apps/Q8EMF8ZB58/analytics/overview
        apiKey: 'bb1f21c46b1bc0bb8dec24e99fb4c328',
        indexName: 'hookstate_js',
        appId: 'Q8EMF8ZB58',
        // algoliaOptions: {}, // Optional, if provided by Algolia
  
        // Optional: see doc section below
        // see https://discourse.algolia.com/t/algolia-searchbar-is-not-working-with-docusaurus-v2/14659
        contextualSearch: false,
    
        // Optional: Algolia search parameters
        searchParameters: {},
  
        // Optional: path for search page that enabled by default (`false` to disable it)
        searchPagePath: 'search',
  
        //... other Algolia params
      },
      navbar: {
        title: 'Hookstate',
        logo: {
          alt: 'Hookstate',
          src: 'img/favicon-196.png',
        },
        items: [
          {to: 'docs/getting-started', label: 'Docs', position: 'left'},
          {to: 'blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/avkonst/hookstate',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Getting started',
                to: 'https://hookstate.js.org/docs/getting-started',
              },
              {
                label: 'API reference',
                to: 'https://hookstate.js.org/docs/typedoc-hookstate-core',
              },
            ],
          },
          {
            title: 'Extensions',
            items: [
              {
                label: 'Standard plugins',
                href: 'https://hookstate.js.org/docs/extensions-overview',
              },
              {
                label: 'Development tools',
                href: 'https://hookstate.js.org/docs/devtools',
              },
            ],
          },
          {
            title: 'Social',
            items: [
              {
                label: 'Blog',
                href: 'https://hookstate.js.org/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/avkonst/hookstate',
              },
              {
                label: 'Discussions',
                href: 'https://github.com/avkonst/hookstate/issues?q=is%3Aissue+is%3Aopen+label%3Aquestion',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Hookstate.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
  }),
  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/avkonst/hookstate/edit/master/docs/index',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        gtag: {
          trackingID: 'UA-146415947-1',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
        googleAnalytics: {
          trackingID: 'UA-146415947-1',
          // Optional fields.
          anonymizeIP: true, // Should IPs be anonymized?
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        }
      }),
    ],
  ]
};

module.exports = config;
