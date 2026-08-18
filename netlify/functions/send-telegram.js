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
    const data = JSON.parse(event.body || "{}");

    // Visitor information received from index2.html
    const {
      ip,
      userAgent,
      country,
      city,
      region,
      isp,
      platform,
      language,
      languages,
      cookieEnabled,
      onLine,
      doNotTrack,
      screenWidth,
      screenHeight,
      screenColorDepth,
      viewportWidth,
      viewportHeight,
      devicePixelRatio,
      timezone,
      localTime,
      visitTime,
      touchSupport,
      connection,
      battery,
      hardwareConcurrency,
      deviceMemory,
      currentPage,
      referrer,
      pageTitle,
    } = data;

    // Create Telegram message
    const message = `
🔍 New Visitor on SONU's Portfolio

📍 LOCATION
• IP: ${ip || "Unknown"}
• Country: ${country || "Unknown"}
• City: ${city || "Unknown"}
• Region: ${region || "Unknown"}
• ISP: ${isp || "Unknown"}

🖥️ DEVICE
• Platform: ${platform || "Unknown"}
• Screen: ${screenWidth || "Unknown"} x ${screenHeight || "Unknown"}
• Viewport: ${viewportWidth || "Unknown"} x ${viewportHeight || "Unknown"}
• Pixel Ratio: ${devicePixelRatio || "Unknown"}
• Touch Support: ${touchSupport ? "Yes" : "No"}
• CPU Cores: ${hardwareConcurrency || "Unknown"}
• RAM: ${deviceMemory || "Unknown"} GB

🌐 BROWSER
• Language: ${language || "Unknown"}
• Languages: ${languages || "Unknown"}
• Cookies: ${cookieEnabled ? "Enabled" : "Disabled"}
• Online: ${onLine ? "Yes" : "No"}
• Do Not Track: ${doNotTrack || "Not set"}

📶 CONNECTION
• Type: ${connection?.effectiveType || "Unknown"}
• Speed: ${connection?.downlink || "Unknown"} Mbps
• Latency: ${connection?.rtt || "Unknown"} ms

🔋 BATTERY
• Level: ${battery?.level || "Unknown"}
• Charging: ${battery?.charging || "Unknown"}

🕐 TIME
• Timezone: ${timezone || "Unknown"}
• Local Time: ${localTime || "Unknown"}
• Visit Time: ${visitTime || "Unknown"}

📄 PAGE
• URL: ${currentPage || "Unknown"}
• Referrer: ${referrer || "Direct visit"}
• Title: ${pageTitle || "Unknown"}

👤 USER AGENT
${userAgent || "Unknown"}
`.trim();

    // Telegram Bot API
    const telegramUrl =
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;

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

    // Telegram returned an error
    if (!response.ok) {
      console.error("Telegram error:", result);

      return {
        statusCode: response.status,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: result.description || "Telegram message failed",
        }),
      };
    }

    // Success
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        success: true,
        message: "Visitor information sent to Telegram",
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
        error: "Internal server error",
      }),
    };
  }
};