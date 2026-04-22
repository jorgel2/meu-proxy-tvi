const axios = require('axios');

export default async function handler(req, res) {
    // Estas 3 linhas são vitais para o Blogger não bloquear
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        const urlVerdadeira = "https://popcdn.day/player.php?stream=TVI";
        const response = await axios.get(urlVerdadeira, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://freeshot.live/'
            }
        });

        const html = response.data;
        const tokenMatch = html.match(/token=([a-zA-Z0-9-]*)/);

        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            const m3u8Url = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            
            // Em vez de redirecionar, vamos enviar o link como TEXTO para o player ler com calma
            res.status(200).send(m3u8Url);
        } else {
            res.status(404).send("Token não encontrado");
        }
    } catch (error) {
        res.status(500).send("Erro no servidor");
    }
}
