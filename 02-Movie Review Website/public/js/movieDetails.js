const textInput = document.getElementById('text-input');
        const characterCount = document.getElementById('character-count');
        const reviewSubmitBtn = document.querySelector(".review-submit-btn");
        const reviewField = document.querySelector(".review-field");
        const msg = document.getElementById("review-text");
        const charLimit = 500;
    
        textInput.addEventListener('input', () => {
            const text = textInput.value;
            const remainingChars = charLimit - text.length;
            characterCount.textContent = Math.max(0, remainingChars);
    
            if (remainingChars < 0) {
                textInput.value = text.substring(0, charLimit);
            }
        });
    
        reviewSubmitBtn.addEventListener("click", () => {
            const text = textInput.value;
            const remainingChars = charLimit - text.length;
    
            if (remainingChars >= 0) {
                const reviewDiv = document.createElement("div");
                reviewDiv.classList.add("review-submitted");
                const reviewMsg = textInput.value;
                msg.innerHTML = reviewMsg;
                const icon = document.createElement("i");
                icon.classList.add("fa-solid", "fa-circle-check");
                icon.style.color = "#2bcc28";
                icon.style.fontSize = "20px";
                
                const textNode = document.createTextNode("Review submitted");
                const textElement = document.createElement("span");
                textElement.appendChild(textNode);
                textElement.style.fontSize = "20px";
    
                reviewDiv.appendChild(icon);
                reviewDiv.appendChild(textElement);
                reviewField.innerHTML = '';
                reviewField.appendChild(reviewDiv);

            }
        });