export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    res.status(400).json({ error: "Missing fields" });
    return;
  }

  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;

  if (!accessKey) {
    res.status(500).json({ error: "Server not configured" });
    return;
  }

  try {
    const web3formsResponse = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        access_key: accessKey,
        subject: `New portfolio message from ${name}`,
        from_name: name,
        name,
        email,
        message,
      }),
    });

    const result = await web3formsResponse.json();

    if (web3formsResponse.ok && result.success) {
      res.status(200).json({ success: true });
    } else {
      res.status(502).json({ error: result.message || "Failed to send" });
    }
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
