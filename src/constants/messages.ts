export const BET_INSUFFICIENT_FUNDS =
  "You have insufficient funds for your bet.";

export const ACTION_ON_COOLDOWN = (secondsLeft: number) =>
  `Calm down there! Try again in ${Math.floor(secondsLeft)} seconds.`;
