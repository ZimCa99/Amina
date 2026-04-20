export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST allowed" });
  }

  const { number, message } = req.body;

  try {
    const response = await fetch("https://rest.messagebird.com/messages", {
      method: "POST",
      headers: {
        "Authorization": `AccessKey ${process.env.MESSAGEBIRD_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        originator: "Sajt",
        recipients: [number],
        body: message,
      }),
    });

    const data = await response.json();
    res.status(200).json(data);

  } catch (err) {
    res.status(500).json({ error: "Failed to send SMS" });
  }
}