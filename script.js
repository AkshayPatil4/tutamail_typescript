var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
// Regular expression for validating the format of the URL.
// This pattern checks for optional protocol, domain, optional port, and optional path.
var urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
// Function to validate if a given URL string matches the defined format pattern.
// Returns true if the URL matches the pattern, otherwise false.
function isValidUrl(url) {
    return urlPattern.test(url); // Uses the regex pattern to validate the URL format
}
// This function randomly decides if the URL exists and whether it's a file or a folder.
// It uses a timeout to mimic the network delay.
function mockServerCheck(url) {
    return new Promise(function (resolve) {
        setTimeout(function () {
            var exists = Math.random() > 0.5; // Randomly decides if the URL exists
            var isFile = Math.random() > 0.5; // Randomly decides if it's a file or a folder
            resolve({
                exists: exists,
                type: exists ? (isFile ? 'File' : 'Folder') : 'Not Found'
            });
        }, 1000); // Simulates a 1-second delay for server response
    });
}
// Throttle function to limit how frequently the URL check is performed.
// Helps to avoid sending too many requests in a short time.
function throttle(func, limit) {
    var lastFunc = null; // Reference to the timeout ID
    var lastRan; // Timestamp of the last execution
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this; // Preserves the function context
        if (!lastRan) {
            func.apply(context, args); // Executes the function immediately if it hasn't been run yet
            lastRan = Date.now(); // Updates the timestamp for the last run
        }
        else {
            if (lastFunc) {
                clearTimeout(lastFunc); // Clears the previous timeout to reset the delay
            }
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args); // Executes the function if the specified limit has passed
                    lastRan = Date.now(); // Updates the last run timestamp
                }
            }, limit - (Date.now() - lastRan)); // Sets a new timeout to ensure the function executes after the limit period
        }
    }; // Ensures the returned function maintains the correct type
}
// Gets references to the input field and result display elements from the DOM.
// These elements will be used to get user input and display results.
var input = document.getElementById('urlInput'); // Input element for URL entry
var resultDiv = document.getElementById('result'); // Div element for displaying the result
// Creates a throttled version of the URL checking function.
// This function validates the URL format and simulates a server check.
var checkUrl = throttle(function (url) { return __awaiter(_this, void 0, void 0, function () {
    var response, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!isValidUrl(url)) return [3 /*break*/, 5];
                input.classList.remove('invalid'); // Removes the invalid class if URL is valid
                input.classList.add('valid'); // Adds the valid class to indicate a correct URL format
                resultDiv.textContent = 'Checking URL...'; // Informs the user that the URL is being checked
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, mockServerCheck(url)];
            case 2:
                response = _a.sent();
                if (response.exists) {
                    resultDiv.textContent = "URL exists and is a ".concat(response.type, "."); // Displays the type of URL if it exists
                }
                else {
                    resultDiv.textContent = 'URL does not exist.'; // Notifys the user if the URL does not exist
                }
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                resultDiv.textContent = 'Error checking URL.'; // Handles errors that occur during the server check
                return [3 /*break*/, 4];
            case 4: return [3 /*break*/, 6];
            case 5:
                input.classList.remove('valid'); // Removes the valid class if URL format is invalid
                input.classList.add('invalid'); // Adds the invalid class to indicate an incorrect URL format
                resultDiv.textContent = 'Invalid URL format.'; // Informs the user of the invalid URL format
                _a.label = 6;
            case 6: return [2 /*return*/];
        }
    });
}); }, 1000); // Throttle limit of 1 second to control the rate of function calls
// Adds an event listener to the input field to trigger URL checks on input changes.
// Uses the throttled function to avoid excessive requests.
input.addEventListener('input', function (event) {
    var target = event.target; // Casts the event target to HTMLInputElement
    checkUrl(target.value); // Calls the throttled function with the current input value
});
