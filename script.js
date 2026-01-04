// Basit "Bizim Hikâyemiz" akışı
// Fotoğrafları assets/ içine koyup buradaki image yollarını güncelleyeceğiz.

const screens = [
  {
    id: "s1",
    title: "Büşra… 💛",
    text: "Bugün senin günün. 7 küçük ekranda, bizim küçük ama çok değerli hikâyemizi gezelim mi?",
    image: "assets/1.jpeg", // örn: "assets/1.jpg"
    next: "s2"
  },
  {
    id: "s2",
    title: "Başlangıç ✨",
    text: "Her şeyin başladığı o an… Benim için hala çok net.",
    image: "assets/2.jpeg",
    next: "s3"
  },
  {
    id: "s3",
    title: "Mini seçim 🎯",
    text: "Sence biz en çok neyle güçleniyoruz?",
    image: "assets/3.jpeg",
    choices: [
      { label: "Birlikte gülmek 😄", goTo: "s4a" },
      { label: "Birbirimizi anlamak 🤍", goTo: "s4b" }
    ]
  },
  {
    id: "s4a",
    title: "Gülüşlerimizin gücü 😄",
    text: "Bazen tek bir bakışın bile yeterli olduğu anlar var ya… İşte o anlar benim favorim.",
    image: "assets/4.jpeg",
    next: "s5"
  },
  {
    id: "s4b",
    title: "Anlaşılmak 🤍",
    text: "En güzel hislerden biri: Birbirimizi anlayan, dinleyen ve destekleyen biz olmamız.",
    image: "assets/5.jpeg",
    next: "s5"
  },
  {
    id: "s5",
    title: "Küçük bir puzzle 🧩",
    text: "Mini bir görev: Ekranın altındaki butona basınca ‘sevgi puanı’ artacak. Hazır mısın?",
    image: "assets/6.jpeg",
    next: "s6",
    bonus: true
  },
  {
    id: "s6",
    title: "Finale geldik 🎁",
    text: "Şimdi son bir seçim: Doğum günü mesajını nasıl alırsın?",
    image: "assets/7.jpeg",
    choices: [
      { label: "Romantik mod 💌", goTo: "s7_romantic" },
      { label: "Eğlenceli mod 😂", goTo: "s7_fun" }
    ]
  },
  {
    id: "s7_romantic",
    title: "İyi ki doğdun Büşra 💛",
    text: "İyi ki varsın. İyi ki hayatımdasın. 2023'ün en güzel sürprizi, her yılın ise en güzel hediyesi. Her gün biraz daha ‘biz’ olmak, bizi biz yapan özelliklerden. 🎂✨",
    image: "assets/8.jpeg",
    next: null
  },
  {
    id: "s7_fun",
    title: "Doğum günü modu: ON 😂🎂",
    text: "Bugün her şey serbest: gülmek, sarılmak, pasta yemek… ve benden sınırsız iltifat almak! İyi ki doğdun! Seni çok seviyorum 💛",
    image: "assets/9.jpeg",
    next: null
  }
];

let currentId = "s1";
let lovePoints = 0;

const elTitle = document.getElementById("title");
const elText = document.getElementById("text");
const elChoices = document.getElementById("choices");
const elNext = document.getElementById("nextBtn");
const elImg = document.getElementById("img");
const elPlaceholder = document.getElementById("placeholder");
const elBar = document.getElementById("bar");
const elStepText = document.getElementById("stepText");

function getScreen(id){
  return screens.find(s => s.id === id);
}

function visibleMainStepsIndex(id){
  // progress için ana akış: s1,s2,s3,(s4a/s4b),s5,s6,(s7*)
  // adım sayacı 7 üzerinden gösterilsin diye basit mapping:
  const map = {
    s1: 1, s2: 2, s3: 3,
    s4a: 4, s4b: 4,
    s5: 5, s6: 6,
    s7_romantic: 7, s7_fun: 7
  };
  return map[id] ?? 1;
}

function render(){
  const screen = getScreen(currentId);
  if(!screen) return;

  // Title/text
  elTitle.textContent = screen.title;
  elText.textContent = screen.text;

  // Progress
  const step = visibleMainStepsIndex(currentId);
  elStepText.textContent = `${step} / 7`;
  elBar.style.width = `${(step/7)*100}%`;

  // Image
  if(screen.image){
    elImg.src = screen.image;
    elImg.style.display = "block";
    elPlaceholder.style.display = "none";
  }else{
    elImg.removeAttribute("src");
    elImg.style.display = "none";
    elPlaceholder.style.display = "flex";
  }

  // Choices
  elChoices.innerHTML = "";
  if(screen.choices && screen.choices.length){
    screen.choices.forEach(ch => {
      const btn = document.createElement("button");
      btn.className = "choiceBtn";
      btn.textContent = ch.label;
      btn.addEventListener("click", () => {
        currentId = ch.goTo;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
      elChoices.appendChild(btn);
    });
    elNext.style.display = "none";
  }else{
    elNext.style.display = "inline-block";
    elNext.textContent = (screen.next ? "Devam →" : "Bitti 💛");
  }

  // Bonus: s5'te puan artırma
 if(screen.bonus){
  const remaining = 3 - lovePoints;
  elNext.textContent = remaining > 0
    ? `Sevgi puanı +1 💛 (${lovePoints}/3) — ${remaining} kaldı`
    : `Tamamlandı! 💛`;
}
}

elNext.addEventListener("click", () => {
  const screen = getScreen(currentId);
if(screen.bonus){
  lovePoints += 1;

  // 3 puana ulaşınca otomatik ilerle
  if (lovePoints >= 3) {
    currentId = screen.next;   // s6'ya geçer
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // aynı ekranda kal, buton text'i güncellensin
  render();
  return;
}

  if(screen.next){
    currentId = screen.next;
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }else{
    // final ekranda tekrar tıklanırsa en başa dönsün istersen:
    currentId = "s1";
    lovePoints = 0;
    render();
  }
});

render();
