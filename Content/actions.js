window.Actions = {
    damage1: {
        name: "Punch",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}"},
            // { type: "animation", animation: "later"},
            { type: "stateChange", damage: 10},
        ]
    },
    Thrash: {
        name: "Thrash",
        success: [
            {type: "textMessage", text: "{CASTER} used {ACTION}"},
            {type: "stateChange", damage: Math.floor(Math.random() * 21)}
        ]
    }
}