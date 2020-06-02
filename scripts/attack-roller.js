import {critCheck} from "./crit-test.js";
import {showResults} from "./show-results.js";

export function compareAttacks(message) {
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
            successStep = 1;
        }

        //Augmenting the success by criticals and natural 20s/1s:
        successStep += critCheck(message.roll, t.actor.data.data.attributes.ac.value);

        //Ensuring the successStep doesn't somehow break the system catastrophically?
        successStep = Math.clamp(successStep, 0, 3);

        let playerActor = game.user.character

        let heroName = playerActor.data.name
        let posHeroName = playerActor.data.name
        if (heroName[heroName.length - 1] == 's') {
            posHeroName =  heroName.substring(0, heroName.length-2)
        }

        let differenceLookup = [
            {
                low:    null,
                high:   -10,
                messages: [
                    {weight: 10, text: `Is ${heroName} even trying?`},
                    {weight: 10, text: `A supreme disappointment.`},
                    {weight:  1, text: `Sad and noob!`},
                    {weight: 10, text: `I hope no one was watching that...`},
                    {weight:  1, text: `${heroName} has small peepee`}
                ]
            },
            {
                low:    -9,
                high:   -5,
                messages: [
                    {weight: 10, text: `The attack falters against the foe's superior defenses.`},
                    {weight: 10, text: `${heroName} will have to try harder than that.`},
                ]
            },
            {
                low:    -4,
                high:   -1,
                messages: [
                    {weight: 10, text: `Heroes never miss, but sometimes their attacks are dodged. Like this one.`},
                    {weight: 10, text: `A near thing, but still a miss.`},
                    {weight: 10, text: `${heroName} narrowly misses their target.`}
                ]
            },
            {
                low:    0,
                high:   4,
                messages: [
                    {weight: 10, text: `${posHeroName}'s strike connects, but just barely.`},
                    {weight: 10, text: `A lucky hit, nothing more.`}
                ]
            },
            {
                low:    5,
                high:   9,
                messages: [
                    {weight: 10, text: `${posHeroName}'s strike was well placed.`},
                    {weight: 10, text: `Another solid hit by ${posHeroName}`}
                ]
            },
            {
                low:    10,
                high:   null,
                messages: [
                    {weight: 10, text: `${heroName} makes a critical strike against their foe!`},
                    {weight: 10, text: `Mortality clarified in a single strike!`},
                    {weight: 10, text: `Decimated! Obliterated! Annhiliated!`},
                    {weight: 10, text: `Destruction awaits this one!`}
                ]
            },

        ]

        let successBy = message.roll.total - t.actor.data.data.attributes.ac.value;
        let selectedMessage = null
        for (let i in differenceLookup) {
            let target = differenceLookup[i]
            if ((target.high == null || successBy <= target.high) && (target.low == null || successBy > target.low)) {
                let weightSum = 0
                for (j in target.messages) {
                    weightSum += target.messages[j].weight
                }

                let randNum = Math.random()*weightSum
                for (let j in target.messages) {
                    if (randNum <= target.messages[i].weight) {
                        selectedMessage = target.messages[i].text

                        break
                    }
                    else {
                        randNum -= target.messages[i].weight
                    }
                }

                break
            }
        }

        
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
                Critically missed! ${selectedMessage}
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
                ❌ Missed! ${selectedMessage}
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
                <b style="color:#4C7D4C">✔️</b> Hit! ${selectedMessage}
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
                Critically Hit! ${selectedMessage}
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