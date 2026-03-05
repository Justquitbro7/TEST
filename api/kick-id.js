// api/kick-id.js
export default async function handler(req, res) {
    const { username } = req.query;
    try {
        const response = await fetch(`https://kick.com/api/v2/channels/${username}`);
        const data = await response.json();
        res.status(200).json({ id: data.chatroom?.id || null });
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch ID" });
    }
}
