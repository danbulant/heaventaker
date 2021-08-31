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
 *  character: typeof import("./characters").characters[number]["name"],
 *  text: string,
 *  next?: string,
 *  pose?: string,
 *  map?: "uriel" | "michael" | "uziel",
 *  chapter?: keyof typeof chapters,
 *  chapterStart?: keyof typeof chapters,
 *  buttons: { text: string, next: string }[],
 *  flags?: ("nosave" | "chapters" | "menu" | "success" | "failure")[]
 * }[]}
 */
export const dialog = [{
    name: "start",
    background: "menu",
    text: "Hello and welcome on your way to heaven. My name is Hadraniel, and I'm the one appointed to you at the moment.",
    next: "start2",
    buttons: [{
        text: "I'd like to go to the heaven's gate.",
        next: "start2"
    }]
}, {
    name: "start2",
    background: "menu",
    character: "Hadraniel",
    text: "Sure. Oh and before you go there, just a warning: don't even think about trying to seduce the angels. It doesn't work here the same as down there.",
    next: "start3"
}, {
    name: "start3",
    background: "menu",
    character: "Hadraniel",
    text: "Wait where are you going? That's not the way to the main gate-",
    next: "uriel_entrance"
}, {
    name: "restart",
    background: "menu",
    character: "Hadraniel",
    text: "Welcome back. What do you desire now?",
    next: "menu"
}, {
    name: "menu",
    background: "menu",
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
    background: "menu",
    character: "Hadraniel",
    text: "Which chapter would you like to solve?",
    alt: "You must first complete a chapter to be able to solve it.",
    next: "menu",
    flags: ["chapters", "nosave"]
}, {
    name: "uriel_entrance",
    chapterStart: "uriel",
    background: "heaven",
    character: "Uriel",
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
    background: "heaven",
    character: "Uriel",
    pose: "semi_angry",
    text: "Really dude? Well if you insist, let's start from the beggining",
    next: "uriel_failure"
}, {
    name: "uriel_failure", 
    background: "heaven",
    character: "Uriel",
    text: "You picked the wrong gate fool.",
    next: "uriel_entrance",
    flags: ["failure"],
    pose: "bat"
}, {
    name: "uriel_success",
    chapter: "uriel",
    background: "heaven",
    character: "Uriel",
    text: "Well since it already got boring around here, and how can I say no to pancakes.",
    flags: ["success"],
    pose: "side_happy",
    next: "michael_heretic"
}, {
    name: "michael_heretic",
    chapterStart: "michael",
    background: "heaven",
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
    background: "heaven",
    character: "Michael",
    pose: "happy",
    text: "Really? Well, big man: if you survive this whole ordeal, prepare a room and we shall see how into this shit you really are",
    flags: ["success"],
    next: "uziel_start"
}, {
    name: "michael_failure",
    background: "heaven",
    character: "Michael",
    text: "I also have something to offer: eat shit and die.",
    pose: "wings",
    flags: ["failure"],
    next: "michael_heretic"
}, {
    name: "uziel_start",
    background: "heaven",
    character: "Uziel",
    chapterStart: "uziel",
    map: "uziel",
    text: "(she appear out of nowhere and suddenly approaches you.)",
    buttons: [{
        text: "oh, you're approaching me? Have you heard of my harem proposal.",
        next: "uziel_failure"
    }, {
        text: "Harem of angle, yes or no ?",
        next: "uziel_success"
    }]
}, {
    name: "uziel_failure",
    background: "heaven",
    character: "Uziel",
    text: "I can't beat the living shit out of you without getting closer.",
    next: "uziel_start",
    flags: ["failure"],
    pose: "dead"
}, {
    name: "uziel_success",
    chapter: "uziel",
    background: "heaven",
    character: "Uziel",
    pose: "happy",
    text: "That had to be the madest and stupidest thing i ever heard. Yes, i must see how this whole thing will end up.",
    flags: ["success"],
    next: "gabriel_start"
}, {
    name: "gabriel_start",
    background: "heaven",
    character: "Gabriel",
    chapterStart: "gabriel",
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
    background: "heaven",
    character: "Gabriel",
    text: "That... That would be lovely actually. Could you buy me some coffee? After my department got defund I can't even afford it.",
    next: "azrael_start",
    pose: "happy",
    flags: ["success"]
}, {
    name: "gabriel_fail",
    background: "heaven",
    character: "Gabriel",
    text: "Oh... you looking for that type of girl, don't worry I know just the place.",
    next: "helltaker",
    pose: "sad"
}, {
    name: "helltaker",
    background: "hell",
    text: "...",
    next: "helltaker2",
    flags: ["helltaker"]
}, {
    name: "helltaker2",
    background: "hell",
    text: "What are you doing here?",
    next: "gabriel_start",
    flags: ["failure"]
}, {
    name: "azrael_start",
    background: "heaven",
    character: "Azrael",
    chapterStart: "azrael",
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
    background: "heaven",
    flags: ["failure"],
    text: "And with that another horny soul bite the dust.",
    pose: "angry"
}, {
    name: "azrael_win",
    chapter: "azrael",
    next: "restart",
    background: "heaven",
    character: "Azrael",
    pose: "happy",
    flags: ["success"],
    text: "I highly doubt that. But you know what fuck it, I'm bored playing against AI anyway."
}];