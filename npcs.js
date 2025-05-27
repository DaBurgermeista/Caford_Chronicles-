

export const npcs = {
    "old_mystic": {
        id: "old_mystic",
        name: "Old Mystic",
        location: "whispering_glade",
        portrait: "assets/npcs/old_mystic.png",
        dialogue: {
            "start": {
                text: "Ah, traveler... you carry the scent of forgotten things.",
                options: [
                    { text: "Who are you?", next: "who"},
                    { text: "Goodbye.", next: "end"}
                ]
            },
            "who": {
                text: "Names matter little here, but you may call me Seer.",
                options: [
                    { text: "What do you see?", next: "vision"},
                    { text: "Goodbye.", next: "end"}
                ]
            },
            "vision": {
                text: "I see a flicker in the glade... a path not yet walked.",
                options: [
                    { text: "Thanks, I guess.", next: "end"}
                ]
            },
            "end": {
                text: "Tread softly, wanderer."
            }
        },
    }
}