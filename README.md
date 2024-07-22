# URL Checker Application

## Overview

The URL Checker application allows users to verify the validity of a URL and check if it exists as a file or folder. Built with HTML, CSS, and TypeScript, this application features a user-friendly interface where users can input a URL and receive feedback on its validity and existence. The application simulates server responses for URL existence checks and employs throttling to manage the frequency of server requests.

## Features

- **URL Validation**: Uses a regular expression to check if the URL format is valid.
- **Throttled Input Handling**: Limits the rate of URL checks to prevent excessive server requests.
- **Mock Server Response**: Simulates a server response to determine if the URL exists and whether it is a file or folder.
- **Dynamic Feedback**: Provides real-time updates on URL validity and existence with visual feedback.

## Technologies

- **HTML**: Provides the structure and layout of the application.
- **CSS**: Styles the application and gives visual feedback based on URL validity.
- **TypeScript**: Implements functionality for URL validation, throttling, and simulated server responses.

## How to Use

1. **Open `index.html` in a web browser**: This will display the URL Checker interface.
2. **Enter a URL in the input field**: The application will validate the URL format and simulate an existence check.
3. **View the results**: The application will indicate whether the URL is valid and whether it exists as a file or folder.

## Code Explanation

### HTML (`index.html`)

- **Structure**:
  ```html
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>URL Checker</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
          }
          input {
              width: 300px;
              padding: 10px;
              border: 2px solid gray;
              border-radius: 5px;
              margin-top: 20px;
              outline: none;
          }
          #result {
              margin-top: 20px;
              font-size: 1.2em;
          }
          .valid {
              border-color: green;
          }
          .invalid {
              border-color: red;
          }
      </style>
  </head>
  <body>
      <h1>URL Checker</h1>
      <input type="text" id="urlInput" placeholder="Enter a URL" />
      <div id="result"></div>
      <script src="script.js"></script>
  </body>
  </html>


- Defines the layout and styles of the application, including an input field for URLs and a results display area.
### TypeScript (script.ts)
1. Regular Expression for URL Validation:
      ```typescript
      const urlPattern: RegExp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;

  - Uses a regex pattern to validate common URL formats, including optional protocol (http or https), domain, port, and path.

2. isValidUrl Function:
   ```typescript
   function isValidUrl(url: string): boolean {
    return urlPattern.test(url); // Returns true if the URL matches the pattern, false otherwise
    }

  - Tests if the provided URL matches the regex pattern and returns a boolean indicating validity.
    
3. mockServerCheck Function:
    ```typescript
    function mockServerCheck(url: string): Promise<ServerResponse> {
    return new Promise<ServerResponse>((resolve) => {
        setTimeout(() => {
            const exists = Math.random() > 0.5; // Randomly decide if the URL exists
            const isFile = Math.random() > 0.5; // Randomly decide if it's a file or folder
            resolve({
                exists,
                type: exists ? (isFile ? 'File' : 'Folder') : 'Not Found'
            });
        }, 1000); // Simulates a server delay of 1 second
    });
    }


- Simulates an asynchronous server response. It randomly determines if the URL exists and its type, mimicking network latency with a delay.

4. throttle Function:
    ```typescript
    function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let lastFunc: ReturnType<typeof setTimeout> | null = null; // Holds the timeout ID
    let lastRan: number | undefined; // Timestamp of the last execution
    return function(this: any, ...args: any[]) {
        const context = this; // Preserve the function context
        if (!lastRan) {
            func.apply(context, args); // Execute immediately if not run before
            lastRan = Date.now(); // Update the last run timestamp
        } else {
            if (lastFunc) {
                clearTimeout(lastFunc); // Clear any pending execution
            }
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan!) >= limit) {
                    func.apply(context, args); // Execute if limit has passed
                    lastRan = Date.now(); // Update the last run timestamp
                }
            }, limit - (Date.now() - lastRan)); // Schedule next execution
        }
    } as T; // Ensure correct function type
    }


- Function Definition:
     - The throttle function takes two parameters
         - func: The function to be throttled.
         - limit: The time interval (in milliseconds) that must pass before func can be called again.
      
- Variables for State Management:
    - lastFunc: Stores the identifier of the last scheduled function call (from setTimeout).
    - lastRan: Stores the timestamp of the last actual function execution.

- Return a New Throttled Function:
    - The returned function will be called in place of the original func. It manages the throttling behavior.

- Capture Context and Arguments:
    - context: Captures the context (this) in which the throttled function is called.
    - args: Captures the arguments passed to the throttled function.
 
- Immediate Execution on First Call:
    - If lastRan is undefined (i.e., the function has not been called yet), the function is executed immediately.
    - lastRan is then set to the current timestamp.
 
- Scheduling the Next Execution:
    - If the function has been called before, any previously scheduled execution is cleared using clearTimeout(lastFunc).
    - A new execution is scheduled using setTimeout.
    - The setTimeout delay is calculated as limit - (Date.now() - lastRan), which ensures the function is executed only after the specified limit interval has passed since the last execution.
    - Inside the setTimeout callback, it checks if the required interval has passed. If so, it executes the function and updates lastRan.  

5. Event Handling and UI Updates:
     ```typescript
     const input = document.getElementById('urlInput') as HTMLInputElement;
    const resultDiv = document.getElementById('result') as HTMLDivElement;
    
    const checkUrl = throttle(async (url: string) => {
        if (isValidUrl(url)) {
            input.classList.remove('invalid');
            input.classList.add('valid');
            resultDiv.textContent = 'Checking URL...';
            try {
                const response = await mockServerCheck(url);
                if (response.exists) {
                    resultDiv.textContent = `URL exists and is a ${response.type}.`;
                } else {
                    resultDiv.textContent = 'URL does not exist.';
                }
            } catch (error) {
                resultDiv.textContent = 'Error checking URL.';
            }
        } else {
            input.classList.remove('valid');
            input.classList.add('invalid');
            resultDiv.textContent = 'Invalid URL format.';
        }
    }, 1000);
    
    input.addEventListener('input', (event: Event) => {
        const target = event.target as HTMLInputElement;
        checkUrl(target.value);
    });

- checkUrl Function: Throttled function to validate the URL format and simulate a server check. Updates the input field’s border color and result text based on validity and existence.
- Event Listener: Attaches to the input field to call checkUrl on user input, applying throttling to manage request frequency.


      
  	
