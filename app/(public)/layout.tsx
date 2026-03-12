import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'
import WhatsAppButton from '@/components/public/WhatsAppButton'
import { getPageSections } from '@/lib/pages'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const footerSections = await getPageSections('footer')
  const tagline = footerSections.tagline?.titre
  const sousTagline = footerSections.sous_tagline?.sousTitre
  const description = footerSections.description?.bodyHtml
  const newsletterIntro = footerSections.newsletter_intro?.bodyHtml
  let linksServices: Array<{ href: string; label: string }> = []
  let linksUtiles: Array<{ href: string; label: string }> = []
  try {
    if (footerSections.links_services?.contenuJson) linksServices = JSON.parse(footerSections.links_services.contenuJson)
    if (footerSections.links_utiles?.contenuJson) linksUtiles = JSON.parse(footerSections.links_utiles.contenuJson)
  } catch { /* ignore */ }

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer
        tagline={tagline}
        sousTagline={sousTagline}
        description={description}
        newsletterIntro={newsletterIntro}
        linksServices={linksServices.length > 0 ? linksServices : undefined}
        linksUtiles={linksUtiles.length > 0 ? linksUtiles : undefined}
      />
      <WhatsAppButton />
    </>
  )
}
