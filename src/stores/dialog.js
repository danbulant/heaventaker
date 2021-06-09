export const chapters = {
    uriel: 1,
    michael: 2,
    uziel: 3,
    gabriel: 4,
    azrael: 5
};

/**
 * @type {{
 *  name: string,
 * background: string,
 * character: string,
 * text: string,
 * next?: string,
 * pose?: string,
 * map?: string,
 * chapter?: keyof typeof chapters,
 * buttons: { text: string, next: string }[],
 * flags?: string[]
 * }[]}
 */
export const dialog = [{
    name: "start",
    background: "/sprite/menu.webp",
    text: "Hello and welcome on your way to heaven. My name is Hadraniel, and I'm the one appointed to you at the moment.",
    next: "start2",
    buttons: [{
        text: "I'd like to go to the heaven's gate.",
        next: "start2"
    }]
}, {
    name: "start2",
    background: "/sprite/menu.webp",
    character: "Hadraniel",
    text: "Sure. Oh and before you go there, just a warning: don't even think about trying to seduce the angels. It doesn't work here the same as down there.",
    next: "start3"
}, {
    name: "start3",
    background: "/sprite/menu.webp",
    character: "Hadraniel",
    text: "Wait where are you going? That's not the way to the main gate-",
    next: "uriel_entrance"
}, {
    name: "menu",
    background: "/sprite/menu.webp",
    character: "Hadraniel",
    text: "",
    buttons: [{
        text: "Start",
        next: "uriel_entrance"
    }, {
        text: "Chapter select",
        next: "chapters"
    }],
    flags: ["menu", "nosave"]
}, {
    name: "chapters",
    background: "/sprite/menu.webp",
    character: "Hadraniel",
    text: "Which chapter would you like to solve?",
    alt: "You must first complete a chapter to be able to solve it.",
    next: "menu",
    flags: ["chapters", "nosave"]
}, {
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
    chapter: "uriel",
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
    map: "michael",
    buttons: [{
        text: "Jokes on you I'm into that shit.",
        next: "michael_success"
    }, {
        text: "I have something to offer.",
        next: "michael_failure"
    }]
}, {
    name: "michael_success",
    chapter: "michael",
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
    chapter: "uziel",
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
    chapter: "gabriel",
    background: "/sprite/backg.webp",
    character: "Gabriel",
    text: "That... That would be lovely actually. Could you buy me some coffee? After my department got defund I can't even afford it.",
    next: "azrael_start",
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
    next: "gabriel_start",
    flags: ["failure"]
}, {
    name: "azrael_start",
    background: "/sprite/backg.webp",
    character: "Azrael",
    text: "Oh my my, what do we have here a lost soul wandering around heaven with an intent lust for angel.",
    buttons: [{
        text: "You're god damn right.",
        next: "azrael_fail"
    }, {
        text: "Nah, I'm just looking for someone to play some RTS with.",
        next: "azrael_win"
    }]
}, {
    name: "azrael_fail",
    next: "azrael_start",
    character: "Azrael",
    background: "/sprite/backg.webp",
    flags: ["failure"],
    text: "And with that another horny soul bite the dust.",
    pose: "angry"
}, {
    name: "azrael_win",
    chapter: "azrael",
    next: "menu",
    background: "/sprite/backg.webp",
    character: "Azrael",
    pose: "happy",
    flags: ["success"],
    text: "I highly doubt that. But you know what fuck it, I'm bored playing against AI anyway."
}];