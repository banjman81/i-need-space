const apiKey = $('#api-key')
const address = $('#address')
const norad = $('#norad')
const search = $('#search')
const resultDisplay = $('.result-display')

// display base on parameter
async function getLocation(key, address, norad){
    const encodeAddress = encodeURI(address)
    const inputUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeAddress}.json?access_token=${key}`
    const rawData = await fetch(inputUrl)
    const data = await rawData.json()
    // console.log(data.features[0].center[0], data.features[0].center[1])
        const getSat = `https://satellites.fly.dev/passes/${norad}?lat=${data.features[0].center[1]}&lon=${data.features[0].center[0]}&limit=100&days=7&visible_only=true`
        console.log(getSat)
        const rawSat = await fetch(getSat)
        const sattelite = await rawSat.json()
        // console.log(sattelite.length)
        const iterations = $(`
            <h4 >Norad ${norad} will be visible for <span class="red">${sattelite.length}</span> time(s) in the next 7 days.</h4>
        `)
        resultDisplay.append(iterations)
        // function for each page loaded
        function loadEach(num){
            const object = sattelite[num-1]

            // DURATION CALCULATOR
            const start = ((object.rise.utc_datetime).slice(11,13)*3600) + ((object.rise.utc_datetime).slice(14,16)*60) + (object.rise.utc_datetime).slice(17,19)*1
            const end = ((object.set.utc_datetime).slice(11,13)*3600) + ((object.set.utc_datetime).slice(14,16)*60) + (object.set.utc_datetime).slice(17,19)*1
            
            let secondsVisible = end - start
            console.log(secondsVisible, 'raw duration')
            // ?divide sec by 60 to get minute and math floor to round down
            let minuteVisible = Math.floor(secondsVisible/60)
            console.log(Math.floor(secondsVisible), 'converted duration')
            // let duration = `00:${("0" + minuteVisible).slice(-2)}:${secondsVisible%60}`

            // seconds to time format calculator
            const newElement = $(`
                <div class="each-pass">
                    <table class="table table-bordered table-hover">
                        <thead>
                            <tr>
                                <th colspan="2">
                                    Satellite NORAD ${norad}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="bold-td">Enter date</td>
                                <td>${(object.rise.utc_datetime).slice(0,11)}</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Enter time</td>
                                <td>${(object.rise.utc_datetime).slice(11,19)}</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Exit date</td>
                                <td>${(object.set.utc_datetime.slice(0,11))}</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Exit time</td>
                                <td>${(object.set.utc_datetime.slice(11,19))}</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Direction of travel</td>
                                <td>from ${object.rise.az_octant} to ${object.culmination.az_octant} and ${object.set.az_octant}</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Duration</td>
                                <td>${minuteVisible} minute(s), ${secondsVisible%60} second(s)</td>
                            </tr>
                            <tr>
                                <td class="bold-td">Visible</td>
                                <td>${object.visible}</td>
                            </tr>
                        </tbody>
                    </table>


                </div>
            `)
            resultDisplay.append(iterations)
            $('.all-passes').append(newElement)
            
        }

        let pageCount = 1
        console.log(pageCount)
        if( sattelite.length >1){
            loadEach(pageCount)
            const buttons = $(`
                    <button class="btn backward hidden">Back</button>
                    <span class="page-counter">${pageCount}/${sattelite.length}</span>
                    <button class="btn forward">Next</button>
            `)
            $('.page-btn').append(buttons)

        }
        else{
            loadEach(pageCount)
        }
        $(".forward").on('click', function(){
            if(pageCount < sattelite.length){
                console.log(pageCount, sattelite.length)
                pageCount++
                $('.all-passes').children().remove()
                loadEach(pageCount)
                $('.backward').removeClass('hidden')
                $('.page-counter').text(`${pageCount}/${sattelite.length}`)
                if(pageCount == sattelite.length){
                    $('.forward').addClass('hidden')
                }
                console.log('next')
            }
        })
        $(".backward").on('click', function(){
            if(pageCount > 1){
                console.log(pageCount, sattelite.length)
                pageCount--
                $('.all-passes').children().remove()
                loadEach(pageCount)
                $('.forward').removeClass('hidden')
                $('.page-counter').text(`${pageCount}/${sattelite.length}`)
                if(pageCount == 1){
                    $('.backward').addClass('hidden')
                }
            }
        })
}


// search handler
search.on('click', function(){
    $('.all-passes').children().remove()
    $('.page-btn').children().remove()
    $('.result-display').children().remove()
    getLocation(apiKey.val(), address.val(), norad.val())
})






