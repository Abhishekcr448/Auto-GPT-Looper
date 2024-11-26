(async () => {
    let customPrompt = ""; // Initialize the custom prompt variable
    let isLooping = false; // Flag to track whether the continuous loop is running
    let loopCount = 1; // Number of times to loop the prompts

    // Wait for an element to become visible
    async function waitForElement(selector, timeout = 10000) {
        const endTime = Date.now() + timeout;
        while (Date.now() < endTime) {
            const element = document.querySelector(selector);
            if (element && element.offsetHeight > 0) {
                return element;
            }
            await new Promise(resolve => setTimeout(resolve, 500)); // Wait 500ms before retrying
        }
        throw new Error(`Element with selector "${selector}" not found within ${timeout}ms`);
    }

    // Function to check if the button is disabled (generation in progress)
    async function isGenerationInProgress() {
        const sendButton = document.querySelector('[data-testid="send-button"]');
        return sendButton ? sendButton.disabled : false;
    }

    // Function to toggle the popup
    function togglePopup() {
        let popup = document.getElementById('custom-prompt-popup');
        if (popup) {
            if (popup.style.display === 'none') {
                popup.style.display = 'block';
                popup.style.opacity = '0';
                setTimeout(() => {
                    popup.style.opacity = '1';
                }, 10);
            } else {
                popup.style.opacity = '0';
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 300);
            }
            return;
        }

        popup = createPopup();
        document.body.appendChild(popup);
        setTimeout(() => {
            popup.style.opacity = '1';
        }, 10);
    }

    // Function to create the custom button
    function createButton() {
        const existingButton = document.querySelector('#custom-prompt-button');
        if (existingButton) return; // Don't create a new button if it already exists

        const customButton = document.createElement('button');
        customButton.id = "custom-prompt-button";
        customButton.style.padding = '10px';
        customButton.style.backgroundColor = 'white';
        customButton.style.border = 'none';
        customButton.style.borderRadius = '5px';
        customButton.style.cursor = 'pointer';
        customButton.style.zIndex = '1000';
        customButton.style.transition = 'all 0.3s ease';
        customButton.style.display = 'flex';
        customButton.style.alignItems = 'center';
        customButton.style.userSelect = 'none';
        customButton.style.borderRadius = '30px';

        customButton.style.padding = '0';
        customButton.style.width = '40px'; // Set the button width
        customButton.style.height = '40px'; // Set the button height
        const buttonImage = document.createElement('img');
        buttonImage.src = chrome.runtime.getURL('icons/icon128.png');
        buttonImage.alt = 'Icon';
        buttonImage.style.width = '100%';
        buttonImage.style.height = '100%';
        buttonImage.style.objectFit = 'cover';
        buttonImage.style.pointerEvents = 'none';


        customButton.appendChild(buttonImage);
        customButton.addEventListener('click', togglePopup);
        customButton.title = 'Auto GPT Looper';

        const header = document.querySelector('.draggable.no-draggable-children.sticky.top-0.p-3.mb-1\\.5.flex.items-center.justify-between.z-10.h-header-height.font-semibold.bg-token-main-surface-primary.max-md\\:hidden');
        if (header) {
            // Find the flex container where existing buttons are located
            const buttonContainer = header.querySelector('.flex.items-center.gap-2'); // Adjust based on your actual layout

            if (buttonContainer) {
                // Append the new button to the container without shifting other elements
                buttonContainer.appendChild(customButton);
            } else {
                console.error('Button container not found');
            }
        } else {
            console.error('Header element not found');
        }
    }

    // Function to create popup elements
    function createPopup() {
        const popup = document.createElement('div');
        popup.id = 'custom-prompt-popup';
        popup.style.position = 'absolute';

        const button = document.getElementById('custom-prompt-button');
        if (button) {
            const rect = button.getBoundingClientRect();
            popup.style.left = rect.left + 'px';
            popup.style.top = (rect.bottom + window.scrollY) + 'px';

            // Adjust position if the popup goes out of the screen
            const popupWidth = 260;
            const screenWidth = window.innerWidth;
            if (rect.left + popupWidth > screenWidth) {
                popup.style.left = (screenWidth - popupWidth - 10) + 'px';
            }
        } else {
            popup.style.left = '280px';
            popup.style.top = '120px';
        }

        popup.style.backgroundColor = '#fff';
        popup.style.padding = '10px';
        popup.style.border = '1px solid #ccc';
        popup.style.borderRadius = '30px';
        popup.style.zIndex = '1001';
        popup.style.overflow = 'auto';
        popup.style.display = 'none';
        popup.style.transition = 'all 0.3s ease';

        const textarea = document.createElement('textarea');
        textarea.style.width = '240px';
        textarea.style.minWidth = '240px';
        textarea.style.height = '100px';
        textarea.style.minHeight = '100px';
        textarea.style.resize = 'both';
        textarea.style.borderRadius = '30px';
        textarea.placeholder = 'Prompt 1...\n\nPrompt 2...';
        textarea.classList.add('placeholder-grey');

        const style = document.createElement('style');
        style.innerHTML = `
        .placeholder-grey::placeholder {
            color: grey;
        }
        `;
        document.head.appendChild(style);
        textarea.style.color = '#000';
        textarea.style.backgroundColor = '#f0f0f0';
        textarea.title = 'Enter prompts separated by line breaks';

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.min = '1';
        countInput.max = '999';
        countInput.value = '1';
        countInput.style.width = '60px';
        countInput.style.marginTop = '10px';
        countInput.style.marginBottom = '10px';
        countInput.style.borderRadius = '30px';
        countInput.title = 'Number of times to loop the prompts';

        const countLabel = document.createElement('label');
        countLabel.textContent = 'Loop Count ';
        countLabel.style.display = 'block';
        countLabel.style.color = '#000';
        countLabel.appendChild(countInput);

        const progressLabel = document.createElement('div');
        progressLabel.textContent = '';
        progressLabel.style.color = '#000';
        progressLabel.style.marginTop = '10px';
        progressLabel.style.fontWeight = 'bold';
        progressLabel.title = 'Progress of the continuous loop';

        const toggleLoopBtn = document.createElement('button');
        toggleLoopBtn.textContent = 'Start Loop';
        toggleLoopBtn.style.color = 'green';
        toggleLoopBtn.style.backgroundColor = '#ddd';
        toggleLoopBtn.style.display = 'block';
        toggleLoopBtn.style.marginLeft = 'auto';
        toggleLoopBtn.style.marginRight = 'auto';
        toggleLoopBtn.style.width = '150px';
        toggleLoopBtn.style.borderRadius = '20px';
        toggleLoopBtn.style.fontWeight = 'bold';
        toggleLoopBtn.title = 'Start/Stop the continuous loop';
        toggleLoopBtn.addEventListener('click', () => {
            if (isLooping) {
                isLooping = false;
                toggleLoopBtn.textContent = 'Start Loop';
                textarea.style.display = 'block';
                countLabel.style.display = 'block';
                progressLabel.textContent = '';
            } else {
                customPrompt = textarea.value;
                loopCount = parseInt(countInput.value) || 1;
                loopCount = Math.min(Math.max(loopCount, 1), 999);
                isLooping = true;
                toggleLoopBtn.textContent = 'Stop Loop';
                textarea.style.display = 'none';
                countLabel.style.display = 'none';
                progressLabel.textContent = 'Completion: 0%';

                (async function loop() {
                    const prompts = customPrompt.split('\n\n').filter(prompt => prompt.trim() !== '');

                    for (let currentLoop = 0; currentLoop < loopCount; currentLoop++) {
                        if (!isLooping) break;
                        // await startPromptLoop(prompts, loopCount, i, totalPrompts, progressLabel);
                        while (!(await isGenerationInProgress())) {
                            await new Promise(resolve => setTimeout(resolve, 1000));
                        }
                        console.log(`Loop ${currentLoop + 1} started`);
                        // await sendPrompt(prompts, totalloopCount, totalPrompts, progressLabel);
                        try {
                            for (let currentPrompt = 0; currentPrompt < prompts.length; currentPrompt++) {
                                if (!isLooping) return;

                                while (!(await isGenerationInProgress())) {
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }

                                // console.log(`Prompt ${currentPrompt + 1} sent`);
                                const inputField = await waitForElement('[contenteditable="true"]');
                                inputField.innerText = prompts[currentPrompt];
                                await new Promise(resolve => setTimeout(resolve, 1000));

                                const sendButton = await waitForElement('[data-testid="send-button"]');
                                sendButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                sendButton.click();

                                const completionPercentage = ((currentLoop * prompts.length + currentPrompt + 1) / (loopCount * prompts.length) * 100).toFixed(2);
                                // console.log(`Prompt ${currentLoop * prompts.length + currentPrompt + 1} sent. Completion: ${completionPercentage}%`);
                                progressLabel.textContent = `Completion: ${completionPercentage}%`;
                                await Promise.resolve();

                                while (await isGenerationInProgress()) {
                                    await new Promise(resolve => setTimeout(resolve, 1000));
                                }
                            }
                        } catch (error) {
                            console.error('Error:', error.message);
                        }
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    isLooping = false;
                    toggleLoopBtn.textContent = 'Start Loop';
                    textarea.style.display = 'block';
                    countLabel.style.display = 'block';
                    progressLabel.textContent = '';
                })();
            }
        });

        const scrapeButton = document.createElement('button');
        scrapeButton.style.marginTop = '10px';
        scrapeButton.textContent = 'Scrape Text';
        scrapeButton.style.color = 'blue';
        scrapeButton.style.backgroundColor = '#ddd';
        scrapeButton.style.display = 'block';
        scrapeButton.style.marginLeft = 'auto';
        scrapeButton.style.marginRight = 'auto';
        scrapeButton.style.width = '150px';
        scrapeButton.style.borderRadius = '20px';
        scrapeButton.style.fontWeight = 'bold';
        scrapeButton.title = 'Scrape all text content from the page';
        scrapeButton.addEventListener('click', () => {
            let questionElements = document.querySelectorAll('.whitespace-pre-wrap');
            let responseElements = document.querySelectorAll('.markdown.prose.w-full.break-words.dark\\:prose-invert.dark p, .markdown.prose.w-full.break-words.dark\\:prose-invert.light p');
            let textContent = '';
            questionElements.forEach((questionElement, index) => {
                let questionText = questionElement.textContent.trim();
                let responseText = responseElements[index] ? responseElements[index].textContent.trim() : '';
                textContent += `Q${index + 1}: ${questionText}\nA${index + 1}: ${responseText}\n\n`;
            });

            const blob = new Blob([textContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Auto_GPT_Looper_extracted_text.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        popup.appendChild(textarea);
        popup.appendChild(countLabel);
        popup.appendChild(progressLabel);
        popup.appendChild(toggleLoopBtn);
        popup.appendChild(scrapeButton);
        return popup;
    }

    // Function to ensure the button remains on the page
    function ensureButtonExists() {
        const existingButton = document.querySelector('#custom-prompt-button');
        if (!existingButton) {
            createButton();
        }
    }

    // Wait for the page to fully load before adding the button
    window.addEventListener('load', () => {
        createButton();
        setInterval(ensureButtonExists, 2000);

        // Close popup if user clicks outside of it
        document.addEventListener('click', (event) => {
            const popup = document.getElementById('custom-prompt-popup');
            const button = document.getElementById('custom-prompt-button');
            if (popup && popup.style.display === 'block' && !popup.contains(event.target) && !button.contains(event.target)) {
                popup.style.opacity = '0';
                setTimeout(() => {
                    popup.style.display = 'none';
                }, 300);
            }
        });
    });
})();
