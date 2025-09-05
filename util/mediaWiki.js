
async function getTagLinks(id, pagenumber) {
    const pageLength = 10
    const parseResponse = await fetch(`https://pt.wikipedia.org/w/api.php?action=parse&pageid=${id}&format=json&prop=text`)    
    const parseData = await parseResponse.json();
    if (parseData.error) {
        throw new Error(`Error: ${parseData.error.info}`);
    }

    const htmlContent = parseData.parse.text['*'];
    
    // Extrair links na ordem que aparecem
    const linkRegex = /<a[^>]*href="\/wiki\/([^"#]*)"[^>]*title="([^"]*)"[^>]*>/g;
    const linksInOrder = [];
    const seenLinks = new Set();
    
    let match;
    while ((match = linkRegex.exec(htmlContent)) !== null) {
        const linkTitle = decodeURIComponent(match[1].replace(/_/g, ' '));
        const displayTitle = match[2];
        
        // Evitar duplicatas e links para arquivos/categorias
        if (!seenLinks.has(linkTitle) && 
            !linkTitle.startsWith('File:') && 
            !linkTitle.startsWith('Category:') &&
            !linkTitle.startsWith('Template:') &&
            !linkTitle.startsWith('Wikipédia:') &&
            !linkTitle.startsWith('Ficheiro:')) {
            
            seenLinks.add(linkTitle);
            linksInOrder.push({
                title: linkTitle,
                parent: id
            });
        }
    }
    const paginatedLinks = linksInOrder.slice(pagenumber * pageLength, pagenumber * pageLength + pageLength)
    if (linksInOrder.length == 0){
        return []
    }

    const linksIds = await getPageIdsBatch(paginatedLinks.map(link => link.title))

    return paginatedLinks.map(link => (linksIds[link.title] ? {...link, pageid: linksIds[link.title]} : undefined));
}


async function getPageIdsBatch(titles) {
    const pageIdsMap = {};
    
    // Processar em batches de 50 (limite da API do MediaWiki)
    const batches = [];
    for (let i = 0; i < titles.length; i += 50) {
        batches.push(titles.slice(i, i + 50));
    }
    
    for (const batch of batches) {
        try {
            const response = await fetch(`https://pt.wikipedia.org/w/api.php?` + new URLSearchParams({
                action: 'query',
                titles: batch.join('|'),
                format: 'json',
                prop: 'info'
            }));
            
            const data = await response.json();
            
            if (data.query && data.query.pages) {
                Object.values(data.query.pages).forEach(pageData => {
                    if (pageData.pageid && pageData.title) {
                        pageIdsMap[pageData.title] = pageData.pageid;
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching page IDs batch:', error);
            // Continuar mesmo se houver erro em um batch
        }
    }
    
    return pageIdsMap;
}

module.exports = getTagLinks