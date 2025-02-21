import { TransactionalEmailsApi, SendSmtpEmail, TransactionalEmailsApiApiKeys } from "@getbrevo/brevo"

// Instanciar API de correos transaccionales
const apiInstance = new TransactionalEmailsApi()

// Establecer la clave de API
apiInstance.setApiKey(TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY as string)

const smtpEmail = new SendSmtpEmail()

export async function SendEmail(email: string, name: string, otp: string) {
  smtpEmail.subject = "Bienvenido a BarberBros - Verifica tu cuenta"
  smtpEmail.to = [{ email: email, name: name }]
  smtpEmail.htmlContent = `
    <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');
          body { font-family: 'Poppins', sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; color: #333; }
          .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); padding: 40px; }
          .logo { text-align: center; margin-bottom: 30px; }
          .logo img { max-width: 200px; }
          h1 { text-align: center; color: #1a202c; font-size: 28px; font-weight: 700; margin-bottom: 20px; }
          p { line-height: 1.6; color: #4a5568; font-size: 16px; }
          .code { display: inline-block; padding: 12px 24px; background-color: #edf2f7; color: #2d3748; font-size: 24px; font-weight: bold; border-radius: 4px; margin: 20px 0; letter-spacing: 2px; }
          .button { display: inline-block; padding: 14px 28px; background-color: #4a5568; color: white; text-decoration: none; border-radius: 4px; font-weight: 600; margin-top: 30px; text-align: center; font-size: 16px; transition: background-color 0.3s ease; }
          .button:hover { background-color: #2d3748; }
          .cta { text-align: center; margin-top: 40px; }
          .footer { text-align: center; margin-top: 60px; font-size: 14px; color: #718096; }
          .features { display: flex; justify-content: space-around; margin-top: 40px; text-align: center; }
          .feature { flex: 1; padding: 0 15px; }
          .feature img { width: 60px; height: 60px; margin-bottom: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">
            <img src="https://7xj6mix7et.ufs.sh/f/1rgYr638BTsaLW4KHqKOsylJhnzPcj1o7TwWrRdGQSUE3kBt" alt="BarberBros Logo" />
          </div>
          <h1>¡Bienvenido a BarberBros!</h1>
          <p>Hola ${name},</p>
          <p>Gracias por unirte a BarberBros, tu plataforma de confianza para reservas de barberías. Estamos emocionados de tenerte a bordo. Para completar tu registro y comenzar a disfrutar de nuestros servicios, por favor utiliza el siguiente código de verificación:</p>

          <div style="text-align: center;">
            <div class="code">${otp}</div>
          </div>

          <div class="features">
            <div class="feature">
              <img src="https://img.icons8.com/fluency/96/barber-pole.png" alt="Reservas fáciles"/>
              <p>Reservas fáciles</p>
            </div>
            <div class="feature">
              <img src="https://img.icons8.com/fluency/96/time.png" alt="Gestión de tiempo"/>
              <p>Gestión eficiente</p>
            </div>
            <div class="feature">
              <img src="https://img.icons8.com/fluency/96/increase-profits.png" alt="Crecimiento del negocio"/>
              <p>Impulsa tu negocio</p>
            </div>
          </div>

          <div class="cta">
            <p>Haz clic en el botón de abajo para verificar tu cuenta y comenzar:</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email" class="button">Verificar mi cuenta</a>
          </div>

          <p>Si eres dueño de una barbería y estás interesado en nuestros servicios profesionales, no dudes en contactarnos para obtener más información sobre cómo BarberBros puede ayudarte a hacer crecer tu negocio.</p>

          <p>Si no solicitaste este correo, puedes ignorarlo de forma segura.</p>

          <div class="footer">
            <p>© ${new Date().getFullYear()} BarberBros. Todos los derechos reservados.</p>
            <p>Síguenos en nuestras redes sociales para las últimas novedades y consejos de barbería.</p>
          </div>
        </div>
      </body>
    </html>
  `
  smtpEmail.sender = { name: "BarberBros", email: "nspes2020@gmail.com" }

  try {
    // Enviar el correo transaccional
    await apiInstance.sendTransacEmail(smtpEmail)
    console.log("Email sent successfully")
  } catch (error) {
    console.error("Error sending email:", error)
  }
}

