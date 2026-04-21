const axios = require('axios');

export default async function handler(req, res) {
    // Configura os cabeçalhos para evitar bloqueios de CORS no teu blog
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // 1. Aceder ao link que contém o iframe do player
        // Usamos um User-Agent para o site pensar que somos um browser real
        const response = await axios.get('https://freeshot.live/embed/TVI.php', {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        const html = response.data;

        // 2. Procurar o token no código HTML
        // O regex procura por algo como token=abc123...
        const tokenMatch = html.match(/token=([a-zA-Z0-9-]*)/);

        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            // Montamos o link final m3u8 que tu descobriste
            const m3u8Url = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            
            // 3. Redirecionar para o link do vídeo
            res.redirect(m3u8Url);
        } else {
            res.status(404).json({ error: "Token não encontrado no código fonte" });
        }
    } catch (error) {
        res.status(500).json({ error: "Erro ao conectar ao servidor de origem" });
    }
}
