const socket = io()

// elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')


// templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML


socket.on('locationMessage', (url) => {
    console.log(url)
    const html = Mustache.render(locationMessageTemplate, { url })
    $messages.insertAdjacentHTML('beforeend', html)
})


socket.on('message', (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, { message })
    $messages.insertAdjacentHTML('beforeend', html)
})


$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled')

    const message = $messageFormInput.value
    socket.emit('sendMessage', message, (error) => {

        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()

        if (error)
            return console.log(error)
        console.log('Message Delivered')
    })
})

$sendLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation)
        return alert('Location sharing not supported by your browser')

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', {
            latitude: position.coords.latitude
            , longitude: position.coords.longitude
        }, () => {
            $sendLocationButton.removeAttribute('disabled')
            console.log('Location Shared')
        })
    })
})