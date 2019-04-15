
// Init EmailJS
emailjs.init("user_dX7huKW88qxnJkjJ5XkRW");
var realSubmitButton = document.getElementById('submitButton');
var fakeSubmitButton = document.getElementById('fakeSubmitButton');

fakeSubmitButton.addEventListener('click', function(e){
    realSubmitButton.click();
});


function onDetailsSubmit(e){
    e.preventDefault();
    var inputs = e.currentTarget;
    emailjs.send("gmail", "contact_us", {
        "name": inputs[0].value,
        "email": inputs[1].value,
        "message": inputs[2].value,
        "subject": 'Fullstack Radar Day'
    }).then(function (response) {
        alert("Thank you");
        console.log(response);
    }, function (err) {
        alert("Sorry, message was not sent");
        console.log(err);
    });
}

function onGetTicketsFBTrack(event){
    fbq('track', 'PageView');
}