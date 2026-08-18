exports.handler = async (event) => {
  console.log("🚀 send-telegram function called");
  console.log("Method:", event.httpMethod);

  // Check environment variables without exposing their values
  console.log(
    "TELEGRAM_BOT_TOKEN exists:",
    !!process.env.TELEGRAM_BOT_TOKEN
  );

  console.log(
    "TELEGRAM_CHAT_ID exists:",
    !!process.env.TELEGRAM_CHAT_ID
  );

  // Only allow POST requests
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
    // Parse visitor data
    const data = JSON.parse(event.body || "{}");

    const {
      ip,
      location,
      device,
      browser,
      os,
      screen,
      referrer,
      timezone,
      battery,
      connection,
      platform,
      language,
      page,
      timestamp,
    } = data;

    // Create Telegram message
    const message = `
🚨 NEW PORTFOLIO VISITOR

🌐 IP:
${ip || "Unknown"}

📍 LOCATION:
${location || "Unknown"}

📱 DEVICE:
${device || "Unknown"}

🌎 BROWSER:
${browser || "Unknown"}

💻 OS:
${os || "Unknown"}

🖥️ SCREEN:
${screen || "Unknown"}

🌐 TIMEZONE:
${timezone || "Unknown"}

🔋 BATTERY:
${battery || "Unknown"}

📶 CONNECTION:
${connection || "Unknown"}

⚙️ PLATFORM:
${platform || "Unknown"}

🗣️ LANGUAGE:
${language || "Unknown"}

📄 PAGE:
${page || "Unknown"}

🔗 REFERRER:
${referrer || "Direct"}

🕐 TIME:
${timestamp || "Unknown"}
`;

    // Check required Telegram environment variables
    if (
      !process.env.TELEGRAM_BOT_TOKEN ||
      !process.env.TELEGRAM_CHAT_ID
    ) {
      console.error("❌ Telegram environment variables are missing");

      return {
        statusCode: 500,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: "Telegram environment variables are missing",
        }),
      };
    }

    // Telegram API URL
    const telegramUrl =
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

    // Send message to Telegram
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const result = await response.json();

    console.log("Telegram API response:", result);

    // Telegram returned an error
    if (!response.ok) {
      console.error("❌ Telegram error:", result);

      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error:
            result.description ||
            "Telegram message failed",
        }),
      };
    }

    // Success
    console.log("✅ Telegram message sent successfully");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Visitor information sent successfully",
      }),
    };
  } catch (error) {
    console.error("❌ Function error:", error);

    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal server error",
      }),
    };
  }
};