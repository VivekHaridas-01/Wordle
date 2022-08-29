import { WORDS } from "./words.js";

const total_chances = 6;
let remain_chances = total_chances;
let current_chance = [];
let input_count = 0;
let answer = WORDS[Math.floor(Math.random() * WORDS.length)];
console.log(answer);

function kb_color(ltr, clr) {
  for (const i of document.getElementsByClassName("kb-btn")) {
    if (i.textContent === ltr) {
      let old_clr = i.style.backgroundColor;
      if (old_clr === "rgb(106, 170, 100)") {
        return;
      }
      if (old_clr === "#rgb(201, 180, 88)" && clr !== "rgb(106, 170, 100)") {
        return;
      }
      i.style.backgroundColor = clr;
      break;
    }
  }
}

function verify() {
  let row = document.getElementsByClassName("row")[6 - remain_chances];
  let word_guess = "";
  let ans_arr = Array.from(answer);

  for (const inp of current_chance) {
    word_guess += inp;
  }

  if (word_guess.length != 5) {
    toastr.error("5 Letters Needed!");
    return;
  }

  if (!WORDS.includes(word_guess)) {
    toastr.error("The word does not exist!");
    return;
  }

  for (let i = 0; i < 5; i++) {
    let ltr_clr = "";
    let box = row.children[i];
    let ltr = current_chance[i];

    let ltr_pos = ans_arr.indexOf(current_chance[i]);
    if (ltr_pos === -1) {
      // Gray the letter as it is not present
      ltr_clr = "rgb(60, 60, 60)";
    } else {
      if (current_chance[i] === ans_arr[i]) {
        // If letter is in the correct position,
        // shade the box green
        ltr_clr = "rgb(106, 170, 100)";
      } else {
        // as letter is present but in wrong position,
        // shade the box yellow
        ltr_clr = "rgb(201, 180, 88)";
      }

      ans_arr[ltr_pos] = "#";
    }

    let delay = 250 * i;
    setTimeout(() => {
      //shade box
      box.style.backgroundColor = ltr_clr;
      kb_color(ltr, ltr_clr);
    }, delay);
  }

  if (word_guess === answer) {
    toastr.success(
      `Perfect Guess! </br>Attempts Made: ${
        total_chances - remain_chances + 1
      }/${total_chances}`
    );
    remain_chances = 0;
    return;
  } else {
    remain_chances -= 1;
    current_chance = [];
    input_count = 0;

    if (remain_chances === 0) {
      toastr.error("No More Guesses Remaining! Game over!");
      toastr.info(`The right word was: "${answer}"`);
    }
  }
}

document.addEventListener("keyup", (e) => {
  if (remain_chances === 0) {
    return;
  }

  let input_letter = String(e.key);
  if (input_letter === "Backspace" && input_count !== 0) {
    let row = document.getElementsByClassName("row")[6 - remain_chances];
    let box = row.children[input_count - 1];
    box.textContent = "";
    box.classList.remove("filled-box");
    current_chance.pop();
    input_count -= 1;
    return;
  }

  if (input_letter === "Enter") {
    // Checks if the entered word is present or not
    verify();
    return;
  }

  // Only allow alphabets to be input
  let match = input_letter.match(/[a-z]/gi);
  if (!match || match.length > 1) {
    return;
  }
  // Inserting a letter
  else {
    if (input_count === 5) {
      return;
    }
    input_letter = input_letter.toLowerCase();

    let row = document.getElementsByClassName("row")[6 - remain_chances];
    let box = row.children[input_count];
    box.textContent = input_letter;
    box.classList.add("filled-box");
    current_chance.push(input_letter);
    input_count += 1;
  }
});

document.getElementById("kb").addEventListener("click", (e) => {
  const tgt = e.target;
  if (!tgt.classList.contains("kb-btn")) {
    return;
  }
  let key = tgt.textContent;
  if (key === "Del") {
    key = "Backspace";
  }
  document.dispatchEvent(new KeyboardEvent("keyup", { key: key }));
});
