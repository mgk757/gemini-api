import { streamGemini } from './gemini-api.js';

let form = document.querySelector('form');
let promptInput = document.querySelector('textarea[name="prompt"]');
let output = document.querySelector('.output');
const textarea = document.getElementById('prompt');

textarea.addEventListener('input', function() {
    this.style.height = 'auto'; // 높이를 초기화하여 계산에 사용될 수 있게 합니다.
    this.style.height = (this.scrollHeight + 2) + 'px'; // 스크롤 높이와 padding을 추가
});

form.onsubmit = async (ev) => {
  ev.preventDefault();
  output.textContent = 'Translating...';

  try {
    // Load the image as a base64 string
    // let imageUrl = form.elements.namedItem('chosen-image').value;
    // let imageBase64 = await fetch(imageUrl)
    //   .then(r => r.arrayBuffer())
    //   .then(a => base64js.fromByteArray(new Uint8Array(a)));
    let input_language = form.elements.namedItem('input_language').value;
    let output_language = form.elements.namedItem('output_language').value;

    // Assemble the prompt by combining the text with the chosen image
    let contents = [
      {
        type: "text",
        text: "You must only show the result. Please translate exactly the following text(word or sentence) from " + input_language + " into " + output_language + ":\n\n " + promptInput.value,
      },
      // {
      //   type: "image_url",
      //   image_url: `data:image/jpeg;base64,${imageBase64}`,
      // },
    ];

    // Call the multimodal model, and get a stream of results
    let stream = streamGemini({
      model: 'gemini-1.5-flash', // or gemini-1.5-pro
      contents,
    });

    // Read from the stream and interpret the output as markdown
    let buffer = [];
    let md = new markdownit();
    for await (let chunk of stream) {
      buffer.push(chunk);
      // output.innerHTML = md.render(buffer.join(''));
      output.innerHTML = ''
      let renderedHtml = md.render(buffer.join(''));
      document.getElementById('output').innerHTML = renderedHtml;
    }
  } catch (e) {
    output.innerHTML += '<hr>' + e;
  }
};
