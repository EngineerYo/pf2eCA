//Code is a mess. I promise I will refactor it soon(TM)

//Clamp Function, pretty handy:
Math.clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
}

function showResults(chatData) {
    //Use this to determine if it should be shown to players or not.
    if (!game.settings.get("pf2qr", "ShowPlayersResults")) {
        chatData["whisper"] = ChatMessage.getWhisperIDs("GM");
        chatData.user = game.users.entities.find(u => u.isGM)._id; //Imitating GM so that we don't see our own message to the GM, in the case it is a player rolling.
        chatData.speaker = ChatMessage.getSpeaker({ user: game.user });
    }
    ChatMessage.create(chatData);
}

/*-------------------------------//++>
<+//         Chat Listeners         //+>
<++//-------------------------------*/

//Post-Create:

/*-------------------------------//~~>
<~//          AC/DC Checks          //~>
<~///-------------------------------*/

function critCheck(roll, DC) {
    let step = 0;
    if (roll.total >= DC + 10) {
        step++;
    }
    if (roll.total <= DC - 10) {
        step--;
    }
    if (roll.parts[0].rolls[0].roll == 20) {
        step++;
    }
    if (roll.parts[0].rolls[0].roll == 1) {
        step--;
    }
    return step;
}

//Attack AC Comparison:
function compareAttacks(message) {
    let compiledMessage = `<div><h3 style='border-bottom: 3px solid black'>Attacks:</h3></div>`;
    game.user.targets.forEach(t => {

        //Success step meaning:
        // 3 = Critical
        // 2 = success
        // 1 = failure
        // 0 = critical failure
        let successStep = -1;

        //getting the base level of success from the roll:
        if (message.roll.total >= t.actor.data.data.attributes.ac.value) {
            successStep = 2;
        } else {
            succesexport class hoverTargeter {sStep = 1;
        }

        //Augmenting the success by criticals and natural 20s/1s:
        successStep += critCheck(message.roll, t.actor.data.data.attributes.ac.value);

        //Ensuring the successStep doesn't somehow break the system catastrophically?
        successStep = Math.clamp(successStep, 0, 3);

        let successBy = message.roll.total - t.actor.data.data.attributes.ac.value;
        switch (successStep) {
            case 0:
                //REIMPLEMENT WITH SETTINGS: t.setTarget(false, { releaseOthers: false, grouSelection: true });
                compiledMessage +=
                    `<div class="targetPicker" data-target="${t.data._id}" data-hitType="cm">
                <div style="color:#131516;margin-top:4px;">
                💔 <b>${t.name}:</b>  
                </div>
                <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
                💔 
                <b style="color:#990000">
                Critically missed${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}!` : `!`)}
                </b>
                </div>
                </div>`
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "💔 Crit Fail", { emote: true });
                break;
            case 1:
                //REIMPLEMENT WITH SETTINGS: t.setTarget(false, { releaseOthers: false, grouSelection: true });
                compiledMessage +=
                    `<div class="targetPicker" data-target="${t.data._id}" data-hitType="m">
                <div style="color:#131516;margin-top:4px;">
                ❌ <b>${t.name}:</b> 
                </div>
                <div style="color:#131516;border-bottom: 2px solid black;padding-bottom:4px;">
                ❌ Missed${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}
                </div>
                </div>`
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "❌ Fail", { emote: true });
                break;
            case 2:
                compiledMessage +=
                    `<div class="targetPicker" data-target="${t.data._id}" data-hitType="h">
                <div style="color:#131516;margin-top:4px;">
                <b style="color:#4C7D4C">✔️</b> <b>${t.name}:</b> 
                </div>
                <div style="color:#131516;border-bottom: 2px solid black;padding-bottom:4px;">
                <b style="color:#4C7D4C">✔️</b> Hit${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}
                </div>
                </div>`
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, `<b style="color:#4C7D4C">✔️</b> Success`, { emote: true });
                break;
            case 3:
                compiledMessage += //`<div style="color:#131516;  border-bottom: 1px solid black;">${t.name}:   💥 <b style="color:#4C7D4C">Critical Success</b> ${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}</div>`
                    `<div class="targetPicker" data-target="${t.data._id}" data-hitType="ch">
                <div style="color:#131516;margin-top:4px;">
                💥 <b>${t.name}:</b>   
                </div>
                <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
                💥 
                <b style="color:#4C7D4C">
                Critically Hit${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}!` : `!`)}
                </b>
                </div>
                </div>`
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "💥 Crit Success", { emote: true });
                break;
            default:
                compiledMessage += `<div style="color:#FF0000">error. Try again, if that doesn't work, your roll command is invalid. Please report it to @Darth_Apples#4725 or on the gitlab page.</div>`;
                break;
        }
    });

    //Determining permissions, and whether to show result or not:
    if (game.user.targets.size > 0) {
        let chatData = {
            user: game.user._id,
            content: compiledMessage
        }
        showResults(chatData);
    }
}

//For automation of damage SoonTM: Wait for pathfinder to add proper damage types.
function augmentDamageButton(data) {
    // let content = data.content;
    // content = content.split('\n');
    // for (let index = 0; index < content.length; index++) {
    //     // const element = content[index];
    //     // if (element.includes("weaponDamage")) {
    //     //     content[index] = "<button data-action='weaponDamage:'>HELLO THERE</button>"
    //     // }
    // }
    // content = content.join('\n');
    // data.content = content;
}

class Marker extends CanvasLayer {
    constructor() {
        super();
        this.init();
    }

    init() {
        this.container = new PIXI.Container();
        this.maxWidth = 300;
        this.padding = 6;
        this.margin = 15;
        this.linesMargin = 4;
        this.width = 0;
        this.height = 0;
        this.addChild(this.container);
    }

    async draw() {
        super.draw();
    }

    UpdateMarker(position, lines) {
        const rectangle = PIXI.Sprite.from(PIXI.Texture.WHITE);
        rectangle.width = 300;
        rectangle.height = 200;
        rectangle.tint = 0xFF0000;
        stage.addChild(rectangle);
    }
}

//Save DC Button Creation:
function createDCButton(data) {
    let content = data.content;
    content = content.split('\n');
    for (let index = 0; index < content.length; index++) {
        const element = content[index];
        if (element.includes("Save DC")) {
            let dtype = 'will';
            if (element.includes("Reflex")) {
                dtype = "reflex";
            }
            if (element.includes("Will")) {
                dtype = "will";
            }
            if (element.includes("Fortitude")) {
                dtype = "fortitude";
            }
            content[index] = content[index].replace(
                `<span>`, '<button data-action="saveDC' + content[index].match(/\d+/g) + dtype + '">');
            content[index] = content[index].replace("</span>", "</button>");
        }
    }
    content = content.join('\n');
    data.content = content;
}

//Listen for Save DC Button presses:


//Save DC Handling:
function forceDCSave(action, dc) {

    const userSettingQuickD20Roll = ((game.user.data.flags.PF2e || {}).settings || {}).quickD20roll;
    if (!(userSettingQuickD20Roll && !event.altKey && !(event.ctrlKey || event.metaKey) && !event.shiftKey || !userSettingQuickD20Roll && event.shiftKey)) {
        ui.notifications.error("Please disable quick rolls in config, or press the appropriate key while rolling, for this to use automation. If that doesn't work, this is a bug.");
    }

    let saveName = 'error';

    if (action.includes('reflex')) {
        saveName = 'reflex';
    }
    if (action.includes('will')) {
        saveName = 'will';
    }
    if (action.includes('fortitude')) {
        saveName = 'fortitude';
    }
    if (saveName === 'error') {
        ui.notifications.error("Invalid save type. Make sure this particular spell has a save type in its config, not all start with one.")
        return;
    }

    const parts = ['@mod'];
    const flavor = `${CONFIG.PF2E.saves[saveName]} Save Check`;

    dc = parseInt(dc[0]);

    let compiledMessage = "<div><h3 style='border-bottom: 3px solid black'>Save Results"/* DC" + dc +*/ + ":</h3>" //ADD A CONFIG FOR THIS IN FUTURE PLEASE!
    game.user.targets.forEach(t => {

        //Success step meaning:
        // 3 = Critical
        // 2 = success
        // 1 = failure
        // 0 = critical failure
        let successStep = -1;

        //Rolling the save from the target actor. WILL NOT WORK OF QUICKROLLS ARE NOT ENABLED
        const save = t.actor.data.data.saves[saveName];
        let roll = DicePF2e.d20Roll({
            event,
            parts,
            data: { mod: save.value },
            title: flavor + " for " + t.name,
            speaker: ChatMessage.getSpeaker({ actor: this })
        });

        //Setting the basic roll from its comparison with DC:
        if (roll.total >= dc) {
            successStep = 2;
        } else {
            successStep = 1;
        }

        //applying effects of crits and naturals:
        successStep += critCheck(roll, dc);
        successStep = Math.clamp(successStep, 0, 3);

        let successBy = roll.total - dc;
        switch (successStep) {
            case 0:
                //REIMPLEMENT WITH SETTINGS: t.setTarget(false, { releaseOthers: false, grouSelection: true });
                compiledMessage +=
                    `
                <div style="color:#131516;margin-top:4px;">
                💔 <b>${t.name}:</b>  
                </div>
                <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
                💔 
                <b style="color:#990000">
                Critically failed${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}!` : `!`)}
                </b> 
                </div>`;
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "💔 Crit Fail", { emote: true });
                break;
            case 1:
                //REIMPLEMENT WITH SETTINGS: t.setTarget(false, { releaseOthers: false, grouSelection: true });
                compiledMessage +=
                    `
                <div style="color:#131516;margin-top:4px;">
                ❌ <b>${t.name}:</b> 
                </div>
                <div style="color:#131516;border-bottom: 2px solid black;padding-bottom:4px;">
                ❌ Failed${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}
                </div>`;
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "❌ Fail", { emote: true });
                break;
            case 2:
                compiledMessage +=
                    `
                <div style="color:#131516;margin-top:4px;">
                <b style="color:#4C7D4C">✔️</b> <b>${t.name}:</b> 
                </div>
                <div style="color:#131516;border-bottom: 2px solid black;padding-bottom:4px;">
                <b style="color:#4C7D4C">✔️</b> Succeeded${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}
                </div>`;
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, `<b style="color:#4C7D4C">✔️</b> Success`, { emote: true });
                break;
            case 3:
                compiledMessage += //`<div style="color:#131516;  border-bottom: 1px solid black;">${t.name}:   💥 <b style="color:#4C7D4C">Critical Success</b> ${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}.` : `.`)}</div>`
                    `
                <div style="color:#131516;margin-top:4px;">
                💥 <b>${t.name}:</b>   
                </div>
                <div style="border-bottom: 2px solid black;color:#131516;padding-bottom:4px;">
                💥 
                <b style="color:#4C7D4C">
                Critically succeeded${(game.settings.get("pf2qr", "ShowExceedsBy") ? ` by ${successBy}!` : `!`)}
                </b>
                </div>`;
                if (game.settings.get("pf2qr", "ShowBubbles")) canvas.hud.bubbles.say(t, "💥 Crit Success", { emote: true });
                break;
            default:
                compiledMessage += `<div style="color:#FF0000">error. Try again, if that doesn't work, your roll command is invalid. Please report it to @Darth_Apples#4725</div>`
                break;
        }
    });

    //finishing message:
    compiledMessage += "</div>"

    //Determining permissions, and whether to show result or not:
    if (game.user.targets.size > 0) {
        let chatData = {
            user: game.user._id,
            content: compiledMessage
        }
        showResults(chatData);
    }
}

//Weapon Attack Damage Dealing:

//Spell Attack Damage Dealing: