document.addEventListener("DOMContentLoaded", function () {
    const quotes = [
      { text: "When you get older, you realise what's important is balance. Whereas, as a kid, all you want is volume.", author: "Anonymous" },
      { text: "All are subservient, all wish to be my friend, to obey, and to think little. People are children.", author: "Siddhartha" },
      { text: "You are the sum total of everything you've ever seen, heard, eaten, smelled, been told, forgot - it's all there. Everything influences each of us, and because of that I try to make sure that my experiences are positive", author: "Maya Angelou" },
      { text: "Change is the only constant in life.", author: "Heraclitus" },
      { text: "I'd rather be a star of hot raging fire that achieves his wildest dreams and dies a spectacular death; rather than a smoldering one that simply leads a long boring life of slowly dimming to darkness.", author: "Danny Casale" },
      { text: "They can take your world, They can take your heart, Cut you loose from all you know, But, if it's your fate, then every step forward will always be a step closer to home", author: "Kingdom Hearts" },
      { text: "Every lie we tell incurs a debt to truth. And sooner or later that debt is paid.", author: "Chernobyl (TV Show)" },
      { text: "Picture a wave, in the ocean. You can see it, measure it, its height, the way the sunlight refracts when it passed through. And it's there. And you can see it, you know what it is. It's a wave. And then it crashes to the shore and it's gone. But the water is still there. The wave was just a different way for the water to be, for a little while. The wave returned to the ocean, where it came from and where it is suppose to be", author: "The Good Place" },
      { text: "Love your solitude.", author: "Rainer Maria Rilke" },
      { text: "You are afraid of dying. But, come now, how is this life of yours anything but death?", author: "Seneca" },
      { text: "It is possible to commit no mistake and still lose. That is not weakness. That is life", author: "Jean Luc Picard" },
      { text: "All things that are given form are fated to break one day. We creators must rather find joy in the process of creation", author: "Gen Urobuchi (Fate Zero)" },
      { text: "Soon as I manage to break through one wall, it feels like I just hit an even higher and thicker wall. All the while, I can hear the sounds of my heroes fighting just beyond it. But I can't make it over to join them. If I'm still here, fumbling around in the dark, how can I ever... Is becoming someone like him, even possible for me?", author: "Tanjiro (Demon Slayer)" },
      { text: "Time is like a river made up of the events which happen, and a violent stream; for as soon as a thing has been seen, it is carried away, and another comes in its place, and this will be carried away too.”", author: "Marcus Aurelius" },
      { text: "You are what you love. Not what loves you", author: "Charlie Kaufman" },
      { text: "No experiment is ever a complete failure. It can always be used as a bad example.", author: "Paul Dickson" },
      { text: "The sun will rise again and the philosopher's will say 'but how do we know it will rise again' and the right answer to say to them is shut the fuck up nerd. stop playing 3D chess with your own brain and find something actually worth worrying about", author: "Philosophy Tube" },
      { text: "It is like taking a shower, you procrastinate to get in, but once you are, you're nice and warm, you don't want to get out. The thing is though, at some point you have to. Otherwise your fingers will turn into prunes. As the water shallows, and it circles down the drain. The more that things are changing, the more they stay the same", author: "Foureyes Furniture" },
      { text: "Don't limit your challenges, challenge your limits", author: "Will Tennyson" },
      { text: "Look for her among her friends", author: "Irvin Yalom's patient" },
      { text: "We cannot be what we want by remaining what we are", author: "Max Depree" },
      { text: "and even the waves of fate can break upon the shores of will", author: "Elminster bg3" },
      { text: "Time seems so infinite when you are young... A month is an age, a year is a lifetime... It is a strange feeling, to realise how little of it one might have left", author: "Gale bg3" },
      { text: "Go easy on yourself. The voice in your head wants to tell you that you're nothing that you should be. And in fact you're everything you're supposed to be", author: "Andrew Rea (Babish)" },
      { text: "Rest at the End, Not in The Middle", author: "Kobe Bryant" },
      { text: "Move well, Study well, Play well, Eat well, Rest well. That is the turtle master way", author: "Akira Toriyama, Dragon Ball" },
      { text: "It does not matter how slowly you go as long as you do not stop", author: "Confucius" },
      { text: "Man cannot discover new oceans unless he has the courage to lose sight of the shore", author: "Andre Gide" },
      { text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", author: "Ernest Hemingway" },
      { text: "There is nothing noble in being superior to your fellow man; true nobility is being superior to your former self.", author: "Ernest Hemingway" },
      { text: "Life shrinks or expands in proportion to one's courage", author: "Anais Nin" },
      { text: "The only way to make sense out of change is to plunge into it, move with it, and join the dance.", author: "Alan Watts" },
      { text: "Be Loyal to the nightmare of your choice", author: "Joseph Conrad" },
      { text: "Struggle is the father of all things", author: "Heraclitus" },
      { text: "That which does not kill us makes us stronger", author: "Nietzsche" },
      { text: "Wealth is the slave of a wise man. The master of a fool", author: "Seneca" },
      { text: "We suffer more in our imagination more often than our reality", author: "Seneca" },
      { text: "Why is Peace always the justification for violence", author: "Arcane, Caitlyn" }
    ];
  
    function generateRandomQuote() {
      const quoteText = document.getElementById("quote-text");
      const quoteAuthor = document.getElementById("quote-author");
  
      if (!quoteText || !quoteAuthor) {
        console.error("Quote elements not found!");
        return;
      }
  
      const randomIndex = Math.floor(Math.random() * quotes.length);
      const quote = quotes[randomIndex];
  
      quoteText.innerText = quote.text;
      quoteAuthor.innerText = "- " + quote.author;
    }
  
    const newQuoteBtn = document.getElementById("new-quote-btn");
    if (newQuoteBtn) {
      newQuoteBtn.addEventListener("click", generateRandomQuote);
    } else {
      console.error("New Quote button not found!");
    }
  
    generateRandomQuote();
  });
  