// Imports
// ========================================================
import express from 'express';
import { JSONRPCServer } from 'json-rpc-2.0';

// Constants
// ========================================================
const app = express();
const server = new JSONRPCServer();
const PORT = 5001;

// Config
// ========================================================
app.use(express.json());

// Methods
// ========================================================
/**
 * 
 */
server.addMethod("echo", ({ text }) => text);

/**
 * 
 */
server.addMethod("log", ({ message }) => console.log({ message }));

/**
 * 
 */
server.addMethod("addTwo", ({ number }) => number + 2);

// Endpoint
// ========================================================
app.post('/json-rpc', (req, res) => {
    // Retrieve body
    const jsonRPCRequest = req.body;
    console.group('/json-rpc\n========================================================');
    console.log({ jsonRPCRequest });
    console.groupEnd();

    // --- Visual Spacer
    console.log(' ');
    console.log(' ');

    // Validation
    if (
        // - is Object
        !Array.isArray(jsonRPCRequest) &&
            (jsonRPCRequest?.jsonrpc !== '2.0' 
            // handles notify requests which don't pass an id
            || (jsonRPCRequest?.id && typeof jsonRPCRequest?.id !== 'number')
            || typeof jsonRPCRequest?.method !== 'string' 
            || !jsonRPCRequest?.params || Object.keys(jsonRPCRequest?.params ?? {}).length == 0)
        // - is Array of Objects
        || Array.isArray(jsonRPCRequest) && 
            (jsonRPCRequest.length === 0
                || jsonRPCRequest.reduce((a, b) => {
                    if (b?.jsonrpc !== '2.0'
                        || (b?.id && typeof b?.id !== 'number')
                        || typeof b?.method !== 'string' 
                        || !b?.params || Object.keys(b?.params ?? {}).length == 0
                    ) {
                        // true = invalid
                        return true;
                    }
                    return a;
                }, false)
            )
        ) {
        const errorMessage = 'Invalid JSON RPC params.';
        console.log({ error: errorMessage });
        return res.status(412).send({
            jsonrpc: '2.0',
            id: jsonRPCRequest?.id ?? 1,
            error: { message: errorMessage }
        });
    }

    // Receive and interpret the request
    server.receive(jsonRPCRequest).then((jsonRPCResponse) => {
        console.log({ jsonRPCResponse });

        // If a response, then return
        if (jsonRPCResponse) {
            return res.json(jsonRPCResponse);
        }
        // If response is absent, it was a JSON-RPC notification method.
        // Respond with no content status (204).
        return res.status(204);
    })
});

// Listen
// ========================================================
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));


