document.addEventListener("DOMContentLoaded", event => {
  const textarea = document.getElementsByTagName("textarea")[0];

  document
    .getElementsByTagName("button")[0]
    .addEventListener("click", () => {
      location.href = location.href.replace("/result", "/");
    });

  const onSelect = event => {
    for (const div of document.querySelectorAll(".language")) {
      const left = div.querySelector(".ruby");
      div.querySelector(".roman").innerHTML =
        [...left.children].map(child => {
          if (child.classList.contains("bare"))
            return child.innerHTML;
          else if (child.classList.contains("one"))
            return "<<<BEGIN PHONETIC>>>" + child.querySelector("rt").innerHTML + "<<<END PHONETIC>>>";
          else if (child.classList.contains("many"))
            return "<<<BEGIN PHONETIC>>>" + child.querySelector("rt").querySelector("select").value + "<<<END PHONETIC>>>";
        })
          .join("")
          .replace(/<<<END PHONETIC>>><<<BEGIN PHONETIC>>>/g, " ")
          //.replace(/<<<BEGIN PHONETIC>>>(.)/g, (match, p) => p.toUpperCase())
          .replace(/<<<BEGIN PHONETIC>>>/g, "")
          .replace(/<<<END PHONETIC>>>/g, "")

          .replace(/，/g, ", ")
          .replace(/。/g, ". ")
          .replace(/！/g, "! ")
          .replace(/？/g, "? ")
          .replace(/：/g, ": ")
          .replace(/；/g, "; ")
          .replace(/（/g, " (")
          .replace(/）/g, ") ")
          .replace(/「/g, " ‹")
          .replace(/」/g, "› ")
          .replace(/『/g, " «")
          .replace(/』/g, "» ")
          .replace(/(?<=[\)›»]) (?=[\.,!?:;])/g, "")
        ;
    }
  }

  for (const select of document.querySelectorAll("select"))
    select.addEventListener("input", onSelect);

  onSelect();

  const buttons = document.querySelectorAll(".buttons button")
  const divs = document.querySelectorAll(".language")
  for (const button of buttons)
    button.addEventListener("click", () => {
      for (const button_ of buttons)
        button_.classList.remove("selected")
      button.classList.add("selected")

      for (const div of divs)
        div.classList.remove("selected")
      document.querySelector("#" + button.getAttribute("data-language")).classList.add("selected")
    });
});
