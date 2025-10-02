const code_input = document.getElementById('code');
const output = document.getElementById('output');

function update() {
  const s = document.createElement('script');
  s.setAttribute('type','text/tikz');
  s.setAttribute('data-show-console','true');
  s.textContent = `
${code_input.value}
  `;
  output.innerHTML = '';
  output.appendChild(s);
}

let debounce_update = null;
let debounce_do = false;

code_input.addEventListener('input',function() {
  if(debounce_update) {
    debounce_do = true;
    return;
  }
  update();
  debounce_update = setTimeout(function() {
    debounce_update = null;
    if(debounce_do) {
      update();
    }
    debounce_do = false;
  },500);
})

update();