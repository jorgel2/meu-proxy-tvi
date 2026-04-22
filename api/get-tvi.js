const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        // 1. Atacamos o NOVO link que tu encontraste
        const urlVerdadeira = "https://popcdn.day/player.php?stream=TVI";
        
        const response = await axios.get(urlVerdadeira, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://freeshot.live/', // Simulamos que viemos do site anterior
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'
            }
        });

        const html = response.data;

        // 2. Procuramos o token dentro do src do iframe que viste
        // Ex: src="https://clouding.wideiptv.top/TVI/embed.html?token=..."
        const tokenMatch = html.match(/token=([a-zA-Z0-9-]*)/);

        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            // Montamos o link .m3u8 final
            const m3u8Url = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            
            // Redireciona para o vídeo
            res.redirect(m3u8Url);
        } else {
            // Se der erro, vamos ver o que o popcdn respondeu ao Vercel
            res.status(200).send("HTML recebido do PopCDN: " + html.substring(0, 500));
        }
    } catch (error) {
        res.status(500).json({ 
            error: "O PopCDN barrou o Vercel", 
            status: error.response ? error.response.status : "Desconhecido" 
        });
    }
}
