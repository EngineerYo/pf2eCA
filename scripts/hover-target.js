export function hoverTarget() {
    $("#chat-log").on('mouseover', '.targetPicker', function () {
        $(this).css("background-color", "yellow");
        let target = (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target")));
        console.log(target);
    });
    $("#chat-log").on('dblclick', '.targetPicker', function (e) {
        let base = this;
        if (!e.shiftKey) { (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(true, { user: game.user, releaseOthers: true }); }
        $(this).parent().children(".targetPicker").each(function () {
            if ($(base).attr("data-hitType") === $(this).attr("data-hitType")) {
                $(this).finish().fadeOut(40).fadeIn(40);
                (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(true, { user: game.user, releaseOthers: false });
            }
        });
    })
    $("#chat-log").on('click', '.targetPicker', function (e) {
        $(this).finish().fadeOut(40).fadeIn(40);
        if (e.shiftKey) {
            if ((canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).isTargeted) {
                (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(false, { user: game.user, releaseOthers: false });
            } else {
                (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(true, { user: game.user, releaseOthers: false });
            }
        } else {
            if ((canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).isTargeted) {
                if (game.user.targets.size > 1) {
                    (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(true, { user: game.user, releaseOthers: true });
                } else {
                    (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(false, { user: game.user, releaseOthers: true });
                }
            } else {
                (canvas.tokens.placeables.find(t => t.data._id === $(this).attr("data-target"))).setTarget(true, { user: game.user, releaseOthers: true });
            }
        }
    });
    $("#chat-log").on('mouseout', '.targetPicker', function () {
        $(this).css("background-color", "transparent");
    });
}
