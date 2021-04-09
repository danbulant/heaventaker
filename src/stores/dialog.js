export const dialog = [{
    name: "uriel_entrance",
    background: "/sprite/backg.webp",
    character: "Uriel",
    pose: "side_normal",
    text: "Ummm... I don't want to be rude so just leave or go to the main gate.",
    map: "uriel",
    buttons: [{
        text: "Step aside, I got heaven to conquer and angels to take.",
        next: "uriel_restart"
    }, {
        text: "Would you like to join my harem? We got puppies and pancakes.",
        next: "uriel_success"
    }]
}, {
    name: "uriel_restart",
    background: "/sprite/backg.webp",
    character: "Uriel",
    text: "Really dude? Well if you insist, let's start from the beggining",
    next: "uriel_failure"
}, {
    name: "uriel_failure", 
    background: "/sprite/backg.webp",
    character: "Uriel",
    text: "You picked the wrong gate fool.",
    next: "uriel_entrance",
    flags: ["failure"],
    pose: "bat"
}, {
    name: "uriel_success",
    background: "/sprite/backg.webp",
    character: "Uriel",
    text: "Well since it already got boring around here, and how can I say no to pancakes.",
    flags: ["success"],
    pose: "side_happy",
    next: "michael_heretic"
}, {
    name: "michael_heretic",
    background: "/sprite/backg.webp",
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
    background: "/sprite/backg.webp",
    character: "Michael",
    pose: "happy",
    text: "Really? Well, big man: if you survive this whole ordeal, prepare a room and we shall see how into this shit you really are",
    flags: ["success"],
    next: "uziel_start"
}, {
    name: "michael_failure",
    background: "/sprite/backg.webp",
    character: "Michael",
    text: "I also have something to offer: eat shit and die.",
    pose: "wings",
    flags: ["failure"],
    next: "michael_heretic"
}, {
    name: "uziel_start",
    background: "/sprite/backg.webp",
    character: "Uziel",
    text: "(she appear out of nowhere and suddenly approaches you.)",
    buttons: [{
        text: "oh, you're approaching me? Had you heard of my harem proposal.",
        next: "uziel_failure"
    }, {
        text: "Harem of angle, yes or no ?",
        next: "uziel_success"
    }]
}, {
    name: "uziel_failure",
    background: "/sprite/backg.webp",
    character: "Uziel",
    text: "I can't beat the living shit out of you without getting closer.",
    next: "uziel_start",
    flags: ["failure"],
    pose: "dead"
}, {
    name: "uziel_success",
    background: "/sprite/backg.webp",
    character: "Uziel",
    pose: "happy",
    text: "That had to be the madest and stupidest thing i ever heard. Yes, i must see how this whole thing will end up.",
    flags: ["success"],
    next: "gabriel_start"
}, {
    name: "gabriel_start",
    background: "/sprite/backg.webp",
    character: "Gabriel",
    text: "Hello sir. My name is Gabriel, Heaven's administration department. How may I help you?",
    buttons: [{
        text: "You look tired, how about let me help you instead.",
        next: "gabriel_success"
    }, {
        text: "How about you ditching this job and come with me.",
        next: "gabriel_fail"
    }]
}, {
    name: "gabriel_success",
    background: "/sprite/backg.webp",
    character: "Gabriel",
    text: "That... That would be lovely actually. Could you buy me some coffee? After my department got defund I can't even afford it.",
    next: "uriel_entrance",
    pose: "happy",
    flags: ["success"]
}, {
    name: "gabriel_fail",
    background: "/sprite/backg.webp",
    character: "Gabriel",
    text: "Oh... you looking for that type of girl, don't worry I know just the place.",
    next: "helltaker",
    pose: "sad"
}, {
    name: "helltaker",
    background: "/sprite/gabriel_background.webp",
    text: "...",
    next: "helltaker2",
    flags: ["helltaker"]
}, {
    name: "helltaker2",
    background: "/sprite/gabriel_background.webp",
    text: "What are you doing here?",
    next: "uriel_entrance",
    flags: ["failure"]
}];