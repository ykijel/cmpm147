// project.js - purpose and description here
// Author: Your Name
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }

  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    adventurer: ["Nomad", "Wayfarer", "Vagabond", "Trailblazer", "Stargazer", "Excalibur", "Lone Wolf", "Spectre"],
    pre: ["Zel", "Vor", "Xer", "Cyb", "Axi", "Syn"],
    post: ["ix", "ium", "orix", "-onix", "orax", "icore", "yphus"],
    people: ["courageous", "enigmatic", "audacious", "intrepid", "ephemeral", "resilient", "effervescent", "luminescent", "serendipitous", "whimsical", "phantasmagoric", "ebullient"],
    item: ["blaster", "orb", "amulet", "staff", "codex", "artifact", "emblem", "relic", "chariot", "sword"],
    num: ["four", "eight", "twenty-five", "innumerable", "multifarious", "copious", "a plethora of", "a myriad of", "an abundance of"],
    looty: ["opulent", "coveted", "sought-after", "precious", "sumptuous", "glamorous", "ethereal", "enigmatic"],
    loots: ["vials of stardust", "arcane tomes", "divine essences", "crystal shards", "essence orbs", "elemental runes", "aetherium crystals", "soul gems", "quantum flux capacitors"],
    baddies: ["cybernetic fiends", "shadow phantoms", "abyssal monstrosities", "arcane abominations", "dread sentinels", "cosmic horrors", "intergalactic tyrants", "apocalyptic heralds"],
    message: ["transmission", "hologram", "scroll", "proclamation", "mystic summons", "telegraph", "manifesto", "revelation", "siren call", "whispering winds", "sorcerer's cry"],
  };
  
  const template = `$adventurer, listen closely to my $message!
  
  I return from the realm of $pre$post, where the $people inhabitants face dire peril. Their sanctuary has fallen to the menace of $baddies. Swift action is imperative; take up my $item and hasten to their aid.
  
  Legend speaks of grand rewards awaiting the savior: $num $looty $loots. Such treasures surely beckon to a soul as bold as yours!
  `;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
}

// let's get this party started - uncomment me
main();
