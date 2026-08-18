exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Method not allowed",
      }),
    };
  }

  try {
    const { name, email, subject, message } = JSON.parse(event.body || "{}");

    if (!name || !email || !subject || !message) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Please fill all required fields.",
        }),
      };
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: ["sonuchoudhary1472006@gmail.com"],
        reply_to: email,
        subject: `Portfolio Contact: ${subject}`,
        text: `
New message from your portfolio

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}
        `,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Resend error:", data);

      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: data.message || "Failed to send email.",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Message sent successfully!",
      }),
    };
  } catch (error) {
    console.error("Function error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal server error.",
      }),
    };
  }
};