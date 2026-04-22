const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    try {
        // 1. Vamos buscar o código ao gerador de tokens
        const response = await axios.get("https://popcdn.day/player.php?stream=TVI", {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://freeshot.live/',
                'Origin': 'https://freeshot.live'
            }
        });

        const html = response.data;
        const tokenMatch = html.match(/token=([a-zA-Z0-9-]*)/);

        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            // Construímos o link final que o teu player vai usar
            const streamUrl = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            res.status(200).send(streamUrl);
        } else {
            res.status(404).send("Token nao encontrado no HTML");
        }
    } catch (error) {
        res.status(500).send("Erro ao conectar ao servidor de video");
    }
}
