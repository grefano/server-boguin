// watchtime de usuarios com interesse parecido no ultimo mes
// como guardar o interesse de usuarios

const { getVideoCommentsAmount } = require("./database/queries/queries_comments");
const { getVideoViewsAmount } = require("./database/queries/queries_data");
const { getFriendRowsByUser } = require("./database/queries/queries_friends");
const supabase = require("./db");

const getFriendsWhoWatched = async (user, id_video) => {
    // const {data, error} = await supabase.from('watchtime').select('time, video(*)').eq('id_user', 'grefano')
    // selecionar amigos
    const friends = await getFriendRowsByUser(user, {status: 'accepted'})
    console.log('friends', friends)
    const {data, error} = await supabase.from('watchtime').select('id_user, created_at, time').eq('id_video', id_video).in('id_user', friends.map((value) => value.id_sender == user ? value.id_receiver : value.id_sender))
    console.log(data)
    console.log('friendswhowatched', data)
    
    return data
}
const getScoreFriends = async (user, id_video) => {
    const friendswatched = await getFriendsWhoWatched(user, id_video)
    // console.log(friendswatched)
    // return true
    return friendswatched.reduce((accumulator, currentValue) => accumulator + currentValue.time, 0)
}
const getVideoScores = async (user, id_video) => {
    return ({
        friends: await getScoreFriends(user, id_video),
        engajement: await getVideoCommentsAmount(id_video) + await getVideoViewsAmount(id_video) 
    })
}
const calculateVideoScore = async (user, id_video) => {
    const scores = await getVideoScores(user, id_video)
    console.log('scores', scores)
    return scores.friends + scores.engajement
}
(async()=>{
    console.log(await calculateVideoScore('grefano', 'ui9ylbdz1pdtdi5hxajv'))
})()

module.exports = {calculateVideoScore, getVideoScores}