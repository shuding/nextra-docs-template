export default {
    logo: <span>Alwayz Docs</span>,
    project: {
      link: 'https://github.com/EV-Hub-Inc/alwayz-docs',
    },
    docsRepositoryBase: 'https://github.com/EV-Hub-Inc/alwayz-docs/blob/main',
    footer: {
      text: 'Alwayz Docs © 2024',
    },
    
    head: ({ title, meta }) => {
      return (
        <>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta name="og:title" content={title} />
        </>
      )
    },
    
  }