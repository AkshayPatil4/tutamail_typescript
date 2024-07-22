
// This interface will be used to type-check the response from the mock server function.
interface ServerResponse {
    exists: boolean;         // Indicates if the URL actually exists
    type: 'File' | 'Folder' | 'Not Found'; // The type of URL if it exists
}

// Regular expression for validating the format of the URL.
// This pattern checks for optional protocol, domain, optional port, and optional path.
const urlPattern: RegExp = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;

// Function to validate if a given URL string matches the defined format pattern.
// Returns true if the URL matches the pattern, otherwise false.
function isValidUrl(url: string): boolean {
    return urlPattern.test(url); // Uses the regex pattern to validate the URL format
}


// This function randomly decides if the URL exists and whether it's a file or a folder.
// It uses a timeout to mimic the network delay.
function mockServerCheck(url: string): Promise<ServerResponse> {
    return new Promise<ServerResponse>((resolve) => {
        setTimeout(() => {
            const exists = Math.random() > 0.5; // Randomly decides if the URL exists
            const isFile = Math.random() > 0.5; // Randomly decides if it's a file or a folder
            resolve({
                exists,
                type: exists ? (isFile ? 'File' : 'Folder') : 'Not Found'
            });
        }, 1000); // Simulates a 1-second delay for server response
    });
}

// Throttle function to limit how frequently the URL check is performed.
// Helps to avoid sending too many requests in a short time.
function throttle<T extends (...args: any[]) => void>(func: T, limit: number): T {
    let lastFunc: ReturnType<typeof setTimeout> | null = null; // Reference to the timeout ID
    let lastRan: number | undefined; // Timestamp of the last execution
    return function(this: any, ...args: any[]) {
        const context = this; // Preserves the function context
        if (!lastRan) {
            func.apply(context, args); // Executes the function immediately if it hasn't been run yet
            lastRan = Date.now(); // Updates the timestamp for the last run
        } else {
            if (lastFunc) {
                clearTimeout(lastFunc); // Clears the previous timeout to reset the delay
            }
            lastFunc = setTimeout(function() {
                if ((Date.now() - lastRan!) >= limit) {
                    func.apply(context, args); // Executes the function if the specified limit has passed
                    lastRan = Date.now(); // Updates the last run timestamp
                }
            }, limit - (Date.now() - lastRan)); // Sets a new timeout to ensure the function executes after the limit period
        }
    } as T; // Ensures the returned function maintains the correct type
}

// Gets references to the input field and result display elements from the DOM.
// These elements will be used to get user input and display results.
const input = document.getElementById('urlInput') as HTMLInputElement; // Input element for URL entry
const resultDiv = document.getElementById('result') as HTMLDivElement; // Div element for displaying the result

// Creates a throttled version of the URL checking function.
// This function validates the URL format and simulates a server check.
const checkUrl = throttle(async (url: string) => {
    if (isValidUrl(url)) { // Checks if the URL format is valid
        input.classList.remove('invalid'); // Removes the invalid class if URL is valid
        input.classList.add('valid'); // Adds the valid class to indicate a correct URL format
        resultDiv.textContent = 'Checking URL...'; // Informs the user that the URL is being checked
        try {
            const response = await mockServerCheck(url); // Simulates server check
            if (response.exists) {
                resultDiv.textContent = `URL exists and is a ${response.type}.`; // Displays the type of URL if it exists
            } else {
                resultDiv.textContent = 'URL does not exist.'; // Notifys the user if the URL does not exist
            }
        } catch (error) {
            resultDiv.textContent = 'Error checking URL.'; // Handles errors that occur during the server check
        }
    } else {
        input.classList.remove('valid'); // Removes the valid class if URL format is invalid
        input.classList.add('invalid'); // Adds the invalid class to indicate an incorrect URL format
        resultDiv.textContent = 'Invalid URL format.'; // Informs the user of the invalid URL format
    }
}, 1000); // Throttle limit of 1 second to control the rate of function calls

// Adds an event listener to the input field to trigger URL checks on input changes.
// Uses the throttled function to avoid excessive requests.
input.addEventListener('input', (event: Event) => {
    const target = event.target as HTMLInputElement; // Casts the event target to HTMLInputElement
    checkUrl(target.value); // Calls the throttled function with the current input value
});
