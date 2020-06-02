export function showResults(chatData) {
    //Use this to determine if it should be shown to players or not.
    if (!game.settings.get("pf2qr", "ShowPlayersResults")) {
        chatData["whisper"] = ChatMessage.getWhisperIDs("GM");
        chatData.user = game.users.entities.find(u => u.isGM)._id; //Imitating GM so that we don't see our own message to the GM, in the case it is a player rolling.
        chatData.speaker = ChatMessage.getSpeaker({ user: game.user });
    }
    ChatMessage.create(chatData);
}