import {hoverTarget} from "./scripts/hover-target.js";
import {critCheck} from "./scripts/crit-test.js";
import {compareAttacks} from "./scripts/attack-roller.js";
import {forceDCSave} from "./scripts/save-roller.js";
import {AbilityTemplate} from "./scripts/abilityTemplate.js";

//Clamp Function, pretty handy:
Math.clamp = function (number, min, max) {
    return Math.max(min, Math.min(number, max));
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

    if(data.content.includes("Area")){
        createTemplateButton(data);
    }
}




Hooks.on("createChatMessage", (message) => {
    if (game.user._id === game.users.entities.find(u => u.isGM)._id || game.settings.get("pf2qr", "PlayersCanQuickRoll")) {
        if (game.combat === null || (game.user._id === game.users.entities.find(u => u.isGM)._id) || !game.settings.get("pf2qr", "RollOnTurn") || (game.combat.combatant.players[0].data._id === game.user._id)) {
            if (message.data.content.includes('<button>Save DC')) createDCButtonListener(message);

            if (!message.data) return true;
            if (!message.data.flavor) return true;
            if (message.data.flavor.includes('Attack Roll') && message.data.user === game.user.data._id) compareAttacks(message);
        }
    }
});

//Pre-Create:
Hooks.on("preCreateChatMessage", (data) => {
    //if (data.content.includes('Damage')) augmentDamageButton(data);
    if (data.content.includes(`<span>Save DC`)) createDCButton(data);
});

Hooks.on('ready', () => {
    [
        {
            name: "ShowPlayersResults",
            hint: "Whether players should see the results of rolls. Private/Blind rolls will serve a similar function soon(TM).",
            scope: "world",
            default: true,
            type: Boolean,
        },
        {
            name: "ShowExceedsBy",
            hint: "Whether to show how much a roll exceeded the AC/DC for.",
            scope: "world",
            default: true,
            type: Boolean,
        }, {
            name: "PlayersCanQuickRoll",
            hint: "If disabled, only the GM can quick roll.",
            scope: "world",
            default: true,
            type: Boolean,
        }, {
            //     name: "UseSelection",
            //     hint: "If enabled, selected tokens are rolled for instead of targeted tokens. This means players cannot quick roll, overrides PlayersCanQuickRoll.",
            //     scope: "world",
            //     default: false,
            //     type: Boolean,
            // }, {
            //     name: "AskPermissionForRoll",
            //     hint: "Players can quick roll, however the GM is sent a request for permission each time.",
            //     scope: "world",
            //     default: false,
            //     type: Boolean,
            // }, {
            name: "RollOnTurn",
            hint: "Players can only roll on their turn in combat. Can roll whenever if not in combat.",
            scope: "world",
            default: false,
            type: Boolean,
        },//, {
        //     name: "SelfSaves",
        //     hint: "Switches saves from forcing a save out of the target to forcing a save out of ones self. Players click the button when they are saving, and the GM clicks the button for monsters.",
        //     scope: "world",
        //     default: false,
        //     type: Boolean,
        // }
        {
            name: "ShowBubbles",
            hint: "Shows bubbles above the heads of tokens for their success. Keep in mind this shows the results to players, though not the exceed by value.",
            scope: "world",
            default: true,
            type: Boolean,

        }
    ].forEach((setting) => {
        let options = {
            name: setting.name,
            hint: setting.hint,
            scope: setting.scope,
            config: true,
            default: setting.default,
            type: setting.type,
        };
        game.settings.register("pf2qr", setting.name, options);
    });

});

Hooks.on('renderChatLog', (log, html) => {
    
    hoverTarget();

    html.on('click', '.card-buttons button', (ev) => {
        const button = $(ev.currentTarget);
        const action = button.attr('data-action');
        if (action.includes('saveDC')) forceDCSave(action, action.match(/\d+/g));
        if (action.includes('template')) createTemplate(button);
    });
});



//Creating of the template buttons in chat log:
function createTemplateButton(data) {
    let content = data.content;
    content = content.split('\n');

    let range = 0;
    let shape = "ERROR";

    for (let index = 0; index < content.length; index++) {
        const element = content[index];
        if (element.includes("Area:")) {
            range = content[index].match(/\d+/g)
            if(element.includes("Burst")){
                shape="circle";
            }
            if(element.includes("Cone")){
                shape="cone";
            }
            if(element.includes("Emanation")){
                shape="rect";
            }
            if(element.includes("Line")){
                shape="ray";
            }
        }
    }
    content = content.join('\n');
    data.content = content;
    data.content+="<div class='card-buttons'><button data-action='template' class='templateButton' data-area='"+range+"' data-shape='"+shape+"'>Place a "+range+"ft "+shape+"</button></div>";
}

var pf2qrGhostTemplate = null;

function createTemplate(button){
    const range = (button[0].attributes['data-area'].value);
    const type = (button[0].attributes['data-shape'].value);
    console.log(type);

    if(pf2qrGhostTemplate!=null) pf2qrGhostTemplate.kill();
    const templateData = {
        t: type,
        user: game.user._id,
        x: 1000,
        y: 1000,
        direction: 0.45,
        angle: 63.13,
        distance: range,
        borderColor: "#FF0000",
        fillColor: "#FF3366",
    };
    if(type==="ray"){
        templateData.width=5;
    }
    if(type==="rect"){
        templateData.direction=45;
        templateData.width=range;
        templateData.distance=Math.hypot(range,range);
    }

    pf2qrGhostTemplate = new AbilityTemplate(templateData);
    pf2qrGhostTemplate.drawPreview();
}