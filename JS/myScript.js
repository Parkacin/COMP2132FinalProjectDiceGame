// Global Variables
    //Images
    const playerDiceImages = [
      "Images/Player/Dice-1.png",
      "Images/Player/Dice-2.png",
      "Images/Player/Dice-3.png",
      "Images/Player/Dice-4.png",
      "Images/Player/Dice-5.png",
      "Images/Player/Dice-6.png"
  ];
  const computerDiceImages = [
      "Images/Computer/Dice-1.png",
      "Images/Computer/Dice-2.png",
      "Images/Computer/Dice-3.png",
      "Images/Computer/Dice-4.png",
      "Images/Computer/Dice-5.png",
      "Images/Computer/Dice-6.png"
  ];
  //Button
  const playButton = $('#playButton');

  //Text Values
  const playerRollTotal = $('#playerRollTotal');
  const computerRollTotal = $('#computerRollTotal');
  const playerRollValue = $('#playerRollValue');
  const computerRollValue = $('#computerRollValue');
  const gameResult = $('#result');

  //Game Variable
  let currentRoll = 0;
  let playerTotal = 0;
  let computerTotal = 0;
  let pRollValue;
  let cRollValue;

  //Animation
  let isAnimating = false;

// Function for rolling a six sided dice and returning a random result
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to add the dice value to a recorded roll value
function recordRoll(player, rollValue, rollIndex) {
  // Create the ID string 
  const rollId = `#${player}RollValue${rollIndex}`;
  document.querySelector(rollId).textContent = rollValue;
}

// Function to update the current roll total for given player
function updateRollTotal(player, total) {
  // Create the ID string
  const totalId = `#${player}RollTotal`;
  document.querySelector(totalId).textContent = total;
}

// Function to determine the rolled dice score
function scoreDice(dice1, dice2) {
  // Return 0 if either dice is a 1
  if(dice1 === 1){
    return 0;
  }
  if(dice2 === 1){
    return 0;
  }
  // Double the dice total if they are the same
  if(dice1 === dice2){
    return (dice1 * 4);
  }
  // Otherwise we just return the two dice added
  else{
    return (dice1 + dice2);
  }
}

// Function to animate dice rolling
function animateDice(player, diceArea, finalRoll1, finalRoll2, callback) {
  // Determine which array of images to select from
  const diceImages = player === "player" ? playerDiceImages : computerDiceImages;
  const diceElements = document.querySelectorAll(`${diceArea} img`);
  const duration = 1000; 
  const interval = 100; 
  const startTime = Date.now();

  // Used to prevent rolling while animating
  isAnimating = true;

  function rollFrame() {
    if (Date.now() - startTime < duration) {
      // Determine a random image to display per frame
      diceElements[0].src = diceImages[Math.floor(Math.random() * 6)];
      diceElements[1].src = diceImages[Math.floor(Math.random() * 6)];
      // Recursion until duration acheived
      setTimeout(rollFrame, interval);
    } else {
      // Stop animation and set final rolls
      isAnimating = false;
      diceElements[0].src = diceImages[finalRoll1 - 1];
      diceElements[1].src = diceImages[finalRoll2 - 1];
      callback(); // Trigger the callback when animation finishes
    }
  }

  rollFrame();
}

// Event when pressing the button can either Roll or Reset game to play again
playButton.on("click", function () {
// Prevent starting a new roll during animation
  if (isAnimating){
      return; 
  } 

  currentRoll++;

  // Executes a roll up to 3, the resets game on next push
  if (currentRoll < 4) {
    // Roll both dice for player and computer
    const playerRoll1 = rollDice();
    const playerRoll2 = rollDice();
    const computerRoll1 = rollDice();
    const computerRoll2 = rollDice();

    // Call Animation for player dice
    animateDice("player", "#playerDice", playerRoll1, playerRoll2, function () {
      // Get the score for rolled dice
      pRollValue = scoreDice(playerRoll1, playerRoll2);
      // Add the score to the total
      playerTotal += pRollValue;
      // Assign the rolled value to the dice Roll Value Text
      playerRollValue.text(pRollValue);
      recordRoll("player", pRollValue, currentRoll);
      updateRollTotal("player", playerTotal);
    });

    // Call Animation for computer dice
    animateDice("computer", "#computerDice", computerRoll1, computerRoll2, function () {
      // Get the score for rolled dice
      cRollValue = scoreDice(computerRoll1, computerRoll2);
      // Add the score to the total
      computerTotal += cRollValue;
      // Assign the rolled value to the dice Roll Value Text
      computerRollValue.text(cRollValue);
      recordRoll("computer", cRollValue, currentRoll);
      updateRollTotal("computer", computerTotal);
    });

    // Check if it's the last roll
    if (currentRoll === 3) {
      // Timeout to allow last roll animation to finish
      timeout = setTimeout(()=>{
        playButton.text("Play Again");
        // Update totals as animation is now finished
        updateRollTotal("player", playerTotal);
        updateRollTotal("computer", computerTotal);

        // Determine game result and display results
        if(playerTotal > computerTotal){
          gameResult.text("You Win!");
          gameResult.addClass("win");
        }
        else if(playerTotal < computerTotal){
          gameResult.text("You Lose");
          gameResult.addClass("lose");
        }
        else{
          gameResult.text("Tie Game"); 
          gameResult.addClass("tie");     
        }
      }, 1100);
      
    }
  } 
  // Reset the game
  else {
    resetGame();
    playButton.text("Roll");
  }
});

// Function to reset the game
function resetGame() {
  // Reset dice images
  document.querySelectorAll("#playerDice img").forEach(img => img.src = playerDiceImages[0]);
  document.querySelectorAll("#computerDice img").forEach(img => img.src = computerDiceImages[0]);

  // Reset roll values
  document.querySelectorAll(".rollValue").forEach(roll => roll.textContent = "-");
  document.querySelectorAll(".roll h3:nth-child(2)").forEach(roll => roll.textContent = "-");

  // Reset totals
  playerTotal = 0;
  computerTotal = 0;
  playerRollTotal.textContent = "-";
  computerRollTotal.textContent = "-";

  // Reset Result
  gameResult.text("");
  gameResult.removeClass();

  // Reset the roll count
  currentRoll = 0;
}
