# Auto GPT Looper

Auto GPT Looper is a Chrome extension designed to interact with ChatGPT on chatgpt.com. This extension allows users to ask a series of predefined questions to ChatGPT continuously in a loop for a specified number of times. Additionally, it can scrape and store all the questions and their corresponding answers in sequence.

## Features

- **Automated Question Looping**: Automatically ask a set of questions to ChatGPT multiple times.
- **Data Scraping**: Scrape and save all questions and answers in a structured format.
- **Customizable**: Configure the number of loops and the list of questions.

## Installation

To install Auto GPT Looper, download the extension from the following link:

<!-- [Download Auto GPT Looper](https://github.com/yourusername/auto-gpt-looper/releases) -->

## Usage

1. **Add Prompts**: Click on the extension icon in the header of chatgpt.com to open a popup. Add your prompts in the popup, with a line space between multiple prompts.
2. **Set Loop Count**: Adjust the loop count (default is 1, maximum is 999).
3. **Start Loop**: Click the start button to begin the looping process. You can see the percentage of completion and a stop button to intercept.
4. **Scrape Data**: After the loop completes, click the scrape button to extract all the text in a question-answer format text file.

## Example

Here is an example of how to set up and run Auto GPT Looper:

1. Add your prompts in the popup:
    ```
    What is the capital of France?

    How does a neural network work?
    ```

2. Set the loop count to 5.

3. Start the loop and monitor the progress.

4. Click the scrape button to save the output in a file named `Auto_GPT_Looper_extracted_text.txt`.

## Output

The output will be saved in a file named `Auto_GPT_Looper_extracted_text.txt`, containing all the questions and their corresponding answers in sequence.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

For any questions or suggestions, please open an issue on the GitHub repository.

