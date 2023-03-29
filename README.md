# Encrypted Message

This repository contains client and server-side code for sending an encrypted message between two parties. The client-side code is written in HTML and JavaScript, and the server-side code is Send Encrypted Message: A Node.js app for secure message exchange between two parties. Client-side uses RSA-OAEP encryption, server-side uses private key decryption. Open-source under ISC License.s code, you will need to have Node.js installed on your computer. If you don't have it already, you can download it from the [official website](https://nodejs.org/en/).

1. Download or clone this repository to your local machine.
2. Open a terminal or command prompt and navigate to the root directory of the repository.
3. Run `npm install` to install any necessary dependencies.
4. Run `node server.js` to start the server.
5. Open `http://localhost:3000/` in a web browser.
6. Enter a message into the text input and click the submit button to send the message to the server.

## Client

The client-side code for this application involves an HTML file 'index.html' that contains a form with a text input and a submit button. The JavaScript file includes an `async` function `sendMessage` that connects to the server to fetch the public key, encrypts the user's message using the public key, and sends the encrypted message to the server via a POST request.

The encryption process involves a few steps. First, the public key is fetched from the server using a fetch request. The key is provided in a JSON Web Key (JWK) format. Next, the user's message is encoded as a buffer using the `TextEncoder()` method. Then, the `window.crypto.subtle.importKey` method is used to import the public key as a CryptoKey object. The key is specified as RSA-OAEP with SHA-256 hashing, and the 'encrypt' parameter indicates that the key can only be used for encryption.

After importing the public key, the `window.crypto.subtle.encrypt` method is used to encrypt the user's message. The encryption algorithm used is RSA-OAEP, and the public key CryptoKey object `publicKeyBuffer` is provided as the key for encryption. The message buffer is provided as a parameter.

Once the user's message is encrypted, it is converted to base64 format using the `btoa` method. The encrypted message is then sent to the server via a POST request. The headers of the request specify the content type as 'application/text'.

To use the client-side code, the user can open `http://localhost:3000/` in a web browser, enter a message into the text input, and click the submit button to send the message to the server. The message will be encrypted using the server's public key before being sent, ensuring that the message is secure during transmission.

## Server

The server runs on Node.js and listens for HTTP requests on port 3000. Its primary functions are handling GET requests and POST requests.

Whenever the server receives a GET request, it checks the URL path to determine what resource the client is requesting. If the client wants the public key in JWK format, the server returns the key in the response. If the client wants the index.html file, the server reads the file and sends its contents in the response. For any other requested resources, the server delivers a "Not found" error.

When the server receives a POST request, it reads the encrypted data that is assumed to be in the request body. The server then decrypts the data using a private key generated during start-up. Finally, the server sends to the client an indication that it has received and decrypted the message.

By default, `createKeyPair()` generates a new RSA key pair with a length of 2048 bits. The function exports the public key in JWK format, which is JSON-formatted with additional metadata. It returns both the public key and the private key.

The `decryptData()` function uses the `privateDecrypt()` method to decrypt the encrypted data and a private key. This method is included in the Node.js `crypto` module and is utilized for RSA decryption purposefully. The `privateDecrypt()` method takes two arguments: options object (for decryption padding and hash algorithm) and a buffer containing encrypted data for decryption.

In the `privateDecrypt()` method, RSA_PKCS1_OAEP_PADDING padding scheme and SHA-256 hash algorithm are specified in the options object. These are the most commonly used algorithms for RSA encryption and decryption.

After decryption, the `decryptData()` function returns the resulting decrypted data as a buffer. Then, it converts the buffer into a string using the `toString()` method, making it readable and understandable by the server.

## References

- [RSA-OAEP](https://en.wikipedia.org/wiki/RSA-OAEP): A cryptographic padding scheme used for RSA encryption.
- [SHA-256](https://en.wikipedia.org/wiki/SHA-2): A cryptographic hash function used for digital signatures, password hashing, and other applications.
- [JSON Web Key (JWK)](https://tools.ietf.org/html/rfc7517): A format for representing cryptographic keys as JSON objects.

For more information on best practices for encryption and security, please refer to the following resources:

- [OWASP Top Ten](https://owasp.org/Top10/): A list of the top ten web application security risks.
- [NIST Special Publication 800-53](https://www.nist.gov/publications/nist-special-publication-800-53-revision-5): A comprehensive guide to security and privacy controls for federal information systems and organizations.
- [Common Weakness Enumeration (CWE)](https://cwe.mitre.org/): A community-developed list of software weaknesses and vulnerabilities.

## License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).
