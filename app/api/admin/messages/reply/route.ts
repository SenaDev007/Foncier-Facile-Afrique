import { NextRequest, NextResponse } from 'next/server'
import { sendMail } from '@/lib/mail'

// POST - Envoyer une réponse par email
export async function POST(request: NextRequest) {
  try {
    const { to, subject, content, originalMessage } = await request.json()

    // Envoyer l'email
    await sendMail({
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4A843 0%, #B8912E 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Foncier Facile Afrique</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Votre partenaire de confiance en immobilier</p>
          </div>
          
          <div style="background: #1C1C1E; padding: 40px 30px;">
            <h2 style="color: #EFEFEF; margin-top: 0;">Réponse à votre message</h2>
            
            <div style="background: #2C2C2E; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #8E8E93; font-size: 14px; margin: 0 0 10px 0;">Votre message original:</p>
              <div style="color: #EFEFEF; font-style: italic; padding: 15px; background: #1C1C1E; border-left: 4px solid #D4A843; border-radius: 4px;">
                ${originalMessage}
              </div>
            </div>
            
            <div style="color: #EFEFEF; line-height: 1.6;">
              ${content}
            </div>
            
            <div style="margin-top: 30px; padding: 20px; background: #2C2C2E; border-radius: 8px;">
              <p style="color: #8E8E93; margin: 0 0 10px 0;">Besoin d'assistance?</p>
              <p style="margin: 0;">
                <a href="tel:+22996901204" style="color: #D4A843; text-decoration: none;">+229 96 90 12 04</a> | 
                <a href="mailto:isdineidisoule@gmail.com" style="color: #D4A843; text-decoration: none;">isdineidisoule@gmail.com</a>
              </p>
            </div>
          </div>
          
          <div style="background: #2C2C2E; padding: 20px; text-align: center; border-top: 1px solid #3A3A3C;">
            <p style="color: #8E8E93; margin: 0; font-size: 12px;">
              © 2024 Foncier Facile Afrique. Tous droits réservés.
            </p>
          </div>
        </div>
      `
    })

    return NextResponse.json({ success: true, message: 'Email envoyé avec succès' })
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error)
    return NextResponse.json({ error: 'Erreur lors de l\'envoi de l\'email' }, { status: 500 })
  }
}
