const apiKey = $('#api-key')
const address = $('#address')
const norad = $('#norad')
const search = $('#search')

async function getLocation(key, address, norad){
    const encodeAddress = encodeURI(address)
    const inputUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeAddress}.json?access_token=${key}`
    const rawData = await fetch(inputUrl)
    const data = await rawData.json()
    console.log(data.features[0].center[0], data.features[0].center[1])
        const getSat = `https://satellites.fly.dev/passes/${norad}?lat=${data.features[0].center[1]}&lon=${data.features[0].center[0]}&limit=100&days=7&visible_only=true`
        
        console.log(getSat)
        const rawSat = await fetch(getSat)
        const sattelite = await rawSat.json()
        console.log(sattelite[0].rise)
}

apiKey.val(myKey)
address.val('chicago')
norad.val(25544)

search.on('click', function(){
    getLocation(apiKey.val(), address.val(), norad.val())
    // console.log(address.val())
    // console.log(norad.val())
})

