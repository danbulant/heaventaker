/**
 * Identity function. Coerces string/number literals to literal types.
 * @template {string | number} T
 * @param {T} v
 * @return {T}
 */
function c(v) {
    return v;
}
  
/**
 * Creates a tuple (array) from the given arguments.
 * @template {any[]} T
 * @param {T} v
 * @return {T}
 */
function t(...v) {
    return v;
}

export const characters = t({
    name: c("Uriel"),
    art: "uriel_idle",
    title: "the gate guardian",
    poses: {
        semi_angry: "uriel_normal",
        side_happy: "uriel_happy",
        bat: "uriel_angry"
    }
}, {
    name: c("Michael"),
    art: "michael_idle",
    title: "the high marshal",
    poses: {
        wings: "michael_angry",
        happy: "michael_happy"
    }
}, {
    name: c("Uziel"),
    art: "uziel_idle",
    title: "the chief commissar",
    poses: {
        happy: "uziel_happy",
        dead: "uziel_angry"
    }
}, {
    name: c("Gabriel"),
    art: "gabriel_idle",
    title: "the administrator",
    poses: {
        happy: "gabriel_win",
        sad: "gabriel_fail"
    }
}, {
    name: c("Azrael"),
    art: "azrael_idle",
    title: "the great executioner",
    poses: {
        happy: "azrael_happy",
        angry: "azrael_angry"
    }
}, {
    name: c("Hadraniel"),
    title: "the seraphim"
}, {
    name: c("Yahweh"),
    title: "the all-seeing",
    art: "yahweh_idle",
    poses: {
        angry1: "yahweh_angry1",
        angry2: "yahweh_angry2",
        confuse: "yahweh_confuse",
        happy: "yahweh_happy"
    }
});