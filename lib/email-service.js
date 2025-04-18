// This is a simplified email service
// In a production app, you would use a service like SendGrid, Mailgun, etc.

export const sendWelcomeEmail = async (email, name, userType) => {
  try {
    // In a real app, you would send an actual email here
    console.log(`Sending welcome email to ${email} (${name}) as ${userType}`)

    // For demo purposes, we'll just log the email content
    const subject = `Welcome to SmartCare, ${name}!`
    let body = `
      <h1>Welcome to SmartCare!</h1>
      <p>Hello ${name},</p>
      <p>Thank you for joining SmartCare as a ${userType}. We're excited to have you on board!</p>
    `

    if (userType === "patient") {
      body += `
        <p>As a patient, you can:</p>
        <ul>
          <li>Book appointments with doctors</li>
          <li>View your medical records</li>
          <li>Manage your prescriptions</li>
          <li>Chat with your healthcare providers</li>
        </ul>
      `
    } else if (userType === "doctor") {
      body += `
        <p>As a doctor, you can:</p>
        <ul>
          <li>Manage your appointments</li>
          <li>View patient records</li>
          <li>Issue prescriptions</li>
          <li>Communicate with patients</li>
        </ul>
      `
    }

    body += `
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The SmartCare Team</p>
    `

    console.log("Email subject:", subject)
    console.log("Email body:", body)

    // In a real app, you would use an email service API here
    // For example, with SendGrid:
    /*
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email }] }],
        from: { email: 'noreply@smartcare.com', name: 'SmartCare' },
        subject,
        content: [{ type: 'text/html', value: body }],
      }),
    })
    
    if (!response.ok) {
      throw new Error(`Failed to send email: ${response.statusText}`)
    }
    */

    return true
  } catch (error) {
    console.error("Error sending welcome email:", error)
    throw error
  }
}

export const sendAppointmentConfirmation = async (email, name, appointmentDetails) => {
  try {
    console.log(`Sending appointment confirmation to ${email} (${name})`)

    const subject = "Your SmartCare Appointment Confirmation"
    const body = `
      <h1>Appointment Confirmation</h1>
      <p>Hello ${name},</p>
      <p>Your appointment has been confirmed:</p>
      <ul>
        <li><strong>Doctor:</strong> ${appointmentDetails.doctorName}</li>
        <li><strong>Date:</strong> ${new Date(appointmentDetails.appointmentDate).toLocaleDateString()}</li>
        <li><strong>Time:</strong> ${appointmentDetails.appointmentTime}</li>
        <li><strong>Type:</strong> ${appointmentDetails.appointmentType}</li>
      </ul>
      <p>If you need to reschedule or cancel, please do so at least 24 hours in advance.</p>
      <p>Best regards,<br>The SmartCare Team</p>
    `

    console.log("Email subject:", subject)
    console.log("Email body:", body)

    return true
  } catch (error) {
    console.error("Error sending appointment confirmation:", error)
    throw error
  }
}

export const sendPrescriptionNotification = async (email, name, prescriptionDetails) => {
  try {
    console.log(`Sending prescription notification to ${email} (${name})`)

    const subject = "New Prescription from SmartCare"
    const body = `
      <h1>New Prescription</h1>
      <p>Hello ${name},</p>
      <p>A new prescription has been issued for you:</p>
      <ul>
        <li><strong>Medication:</strong> ${prescriptionDetails.medication}</li>
        <li><strong>Dosage:</strong> ${prescriptionDetails.dosage}</li>
        <li><strong>Frequency:</strong> ${prescriptionDetails.frequency}</li>
        <li><strong>Start Date:</strong> ${new Date(prescriptionDetails.startDate).toLocaleDateString()}</li>
        <li><strong>End Date:</strong> ${prescriptionDetails.endDate ? new Date(prescriptionDetails.endDate).toLocaleDateString() : "Ongoing"}</li>
      </ul>
      <p>Please follow the instructions carefully. If you have any questions, contact your doctor.</p>
      <p>Best regards,<br>The SmartCare Team</p>
    `

    console.log("Email subject:", subject)
    console.log("Email body:", body)

    return true
  } catch (error) {
    console.error("Error sending prescription notification:", error)
    throw error
  }
}

export const sendFeedbackResponse = async (email, name, feedbackDetails) => {
  try {
    console.log(`Sending feedback response to ${email} (${name})`)

    const subject = "Response to Your SmartCare Feedback"
    const body = `
      <h1>Feedback Response</h1>
      <p>Hello ${name},</p>
      <p>Thank you for your feedback. Our team has reviewed it and here is our response:</p>
      <div style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #ccc; margin: 10px 0;">
        <p><em>${feedbackDetails.response}</em></p>
      </div>
      <p>We appreciate your input as it helps us improve our services.</p>
      <p>Best regards,<br>The SmartCare Team</p>
    `

    console.log("Email subject:", subject)
    console.log("Email body:", body)

    return true
  } catch (error) {
    console.error("Error sending feedback response:", error)
    throw error
  }
}
