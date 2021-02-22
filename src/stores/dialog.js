export const dialog = [{
    name: "michael_heretic",
    background: "/sprite/fin_backg.png",
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
    background: "/sprite/fin_backg.png",
    character: "Michael",
    text: "Really? Well, big man: if you survive this whole ordeal, prepare a room and we shall see how into this shit you really are",
    flags: ["success"],
    next: "michael_heretic"
}, {
    name: "michael_failure",
    background: "/sprite/fin_backg.png",
    character: "Michael",
    text: "I also have something to offer: eat shit and die.",
    pose: "wings",
    next: "michael_heretic"
}];