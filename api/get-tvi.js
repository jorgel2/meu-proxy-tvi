const axios = require('axios');

export default async function handler(req, res) {
    // Configurações para o player não se queixar de segurança
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');

    try {
        // 1. "Exploit": Fingimos ser um browser vindo do site oficial
        const response = await axios.get("https://popcdn.day/player.php?stream=TVI", {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://freeshot.live/',
            }
        });

        // 2. Extraímos o token do meio do código
        const tokenMatch = response.data.match(/token=([a-zA-Z0-9-]*)/);
        
        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            // Construímos o link do Manifesto (M3U8)
            const finalStream = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            
            // 3. Em vez de dar o link, redirecionamos o player diretamente para o fluxo de vídeo
            res.redirect(302, finalStream);
        } else {
            res.status(404).send("#EXTM3U\n#ERROR-TOKEN-NOT-FOUND");
        }
    } catch (error) {
        res.status(500).send("#EXTM3U\n#ERROR-CONNECTION-FAILED");
    }
}
