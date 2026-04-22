const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');

    try {
        const response = await axios.get('https://freeshot.live/embed/TVI.php', {
            // Estes cabeçalhos dizem ao servidor: "Eu já estou aqui dentro, não me expulses!"
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://freeshot.live/', 
                'Origin': 'https://freeshot.live',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
                'Accept-Language': 'pt-PT,pt;q=0.9,en-US;q=0.8,en;q=0.7',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache'
            },
            maxRedirects: 0, // Impede que o Axios siga o redirecionamento para a home
            validateStatus: (status) => status >= 200 && status < 400 
        });

        const html = response.data;

        // Se o código fonte vier no 'view-source', este regex vai apanhá-lo:
        const tokenMatch = html.match(/token=([a-zA-Z0-9-]*)/);

        if (tokenMatch && tokenMatch[1]) {
            const token = tokenMatch[1];
            const m3u8Url = `https://clouding.wideiptv.top/TVI/tracks-v1/index.fmp4.m3u8?token=${token}`;
            
            // Em vez de redirecionar (que pode dar erro de CORS), vamos devolver o link como texto
            // ou redirecionar. Vamos tentar o redirecionamento primeiro:
            res.redirect(m3u8Url);
        } else {
            // Se ainda assim não der, vamos ver o que o servidor enviou de facto
            res.status(200).send("O servidor redirecionou ou o token mudou de lugar. HTML recebido: " + html.substring(0, 200));
        }
    } catch (error) {
        // Se houver erro de redirecionamento (302), tentamos apanhar o que resta
        res.status(500).json({ error: "O site bloqueou o servidor do Vercel", detalhes: error.message });
    }
}
