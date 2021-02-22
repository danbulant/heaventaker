export const dialog = [{
    name: "uriel_entrance",
    background: "/sprite/backg.png",
    character: "Uriel",
    pose: "side_normal",
    text: "Ummm... I don't want to be rude so just leave or go to the main gate.",
    buttons: [{
        text: "Step aside, I got heaven to conquer and angels to take.",
        next: "uriel_restart"
    }, {
        text: "Would you like to join my harem? We got puppies and pancakes.",
        next: "uriel_success"
    }]
}, {
    name: "uriel_restart",
    background: "/sprite/backg.png",
    character: "Uriel",
    text: "Really dude? Well if you insist, let's start from the beggining",
    next: "uriel_failure"
}, {
    name: "uriel_failure", 
    background: "/sprite/backg.png",
    character: "Uriel",
    text: "You picked the wrong gate fool.",
    next: "uriel_entrance",
    pose: "bat"
}, {
    name: "uriel_success",
    background: "/sprite/backg.png",
    character: "Uriel",
    text: "Well since it already got boring around here, and how can I say no to pancakes.",
    flags: ["success"],
    next: "michael_heretic"
}, {
    name: "michael_heretic",
    background: "/sprite/backg.png",
    character: "Michael",
    text: "How did you... You know what I don't even care. Heretic like you needs to be punished.",
    buttons: [{
        text: "Jokes on you I'm into that shit.",
        next: "michael_success"
    }, {
        text: "I have something to offer.",
        next: "michael_failure"
    }]
}, {
    name: "michael_success",
    background: "/sprite/backg.png",
    character: "Michael",
    pose: "happy",
    text: "Really? Well, big man: if you survive this whole ordeal, prepare a room and we shall see how into this shit you really are",
    flags: ["success"],
    next: "uriel_entrance"
}, {
    name: "michael_failure",
    background: "/sprite/backg.png",
    character: "Michael",
    text: "I also have something to offer: eat shit and die.",
    pose: "wings",
    next: "michael_heretic"
}];