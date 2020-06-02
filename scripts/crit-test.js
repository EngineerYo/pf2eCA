export function critCheck(roll, DC) {
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