/* eslint-env node */
import { Footer, Layout, Navbar } from 'nextra-theme-docs'
import { Banner, Head } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-docs/style.css'
import Image from 'next/image'
import './globals.css'

export const metadata = {
  metadataBase: new URL('https://docs.mtdcloud.eu'),
  title: {
    template: '%s - MTD CLOUD'
  },
  description: 'MTD CLOUD Platform Documentation',
  applicationName: 'Documentation',
  generator: 'Next.js',
  appleWebApp: {
    title: 'Documentation'
  },
  other: {
    'msapplication-TileImage': '/ms-icon-144x144.png',
    'msapplication-TileColor': '#fff'
  },
  twitter: {
    site: 'https://nextra.site'
  }
}

export default async function RootLayout({ children }) {
  const navbar = (
    <Navbar
      logo={
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="https://storage.googleapis.com/mtd-other-assets/mtdcloud-logo-light.png"
            alt="MTD Cloud"
            width={126}
            height={29}
            priority
            className="logoLight"
            style={{ height: 'auto', width: 126 }}
          />
          <Image
            src="https://storage.googleapis.com/mtd-other-assets/mtdcloud-logo-dark.svg"
            alt="MTD Cloud"
            width={126}
            height={29}
            priority
            className="logoDark"
            style={{ height: 'auto', width: 126 }}
          />
        </div>
      }
      // Next.js discord server
      chatLink="https://discord.gg/hEM84NMkRv"
    />
  )
  const pageMap = await getPageMap()
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <Head faviconGlyph="✦" />
      <body>
        <Layout
          banner={
            <Banner storageKey="mtd-cloud-banner">
              <strong>MTD Cloud Docs</strong> — Kubernetes-native platform services (Clusters, Serverless, Data Stores, Observability, Confidential Computing).
            </Banner>
          }
          navbar={navbar}
          footer={<Footer>MIT {new Date().getFullYear()} © MTD CLOUD.</Footer>}
          editLink="Edit this page on GitHub"
          docsRepositoryBase="https://github.com/mtdcloud/documentation"
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          pageMap={pageMap}
        >
          {children}
        </Layout>
      </body>
    </html>
  )
}