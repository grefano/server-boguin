const express = require('express')
const router = express.Router()

const wiki = require('wikipedia')
wiki.setLang('pt')
const getTagLinks = require('../util/mediaWiki')

async function getTagMatch(tag){
    try {
        const search = await wiki.search(tag)
        let results = search.results.slice(0,5)
        // console.log('search',search)
        
        if (search.suggestion){
            const searchSuggestion = await wiki.search(search.suggestion)
            // console.log('search suggestion',searchSuggestion)
            results = results.concat(searchSuggestion.results.slice(0,5))

        }
        
        return {rawtag: tag, suggestion: search.suggestion, pages: results}
    } catch (error) {
        console.log('error wiki page', error)
        return {rawtag: tag, pages: []}
    }
}



router.get('/match/:tag', async (req, res) => {
    const {tag} = req.params
    console.log('tag match', tag)
    const match = await getTagMatch(tag)
    res.status(200).json(match)
})

router.post('/match', express.json(), async (req, res) => {
    // matching das palavras escritas com artigos da wikipedia
    console.log('tags match')
    
    const names = req.body
    const promises = names.map(async (element) => {
        return await getTagMatch(element)
    });
    const matches = await Promise.all(promises)
    // console.log('matches: ', matches)
    res.status(200).json(matches)
})

router.get('/links/:id', async (req, res) => {
    const {id} = req.params
    const {page} = req.query
    // const apiUrl = `https://pt.wikipedia.org/w/api.php?action=query&pageids=${id}&prop=externallinks|links&format=json`;
    // const response = await fetch(apiUrl)
    // // const data = await response.json()
    // const links = data.query.pages[id.toString()].links
    console.log(page)
    const links = await getTagLinks(id, page)
    console.log(links)
    res.status(200).json(links)
})

module.exports = router