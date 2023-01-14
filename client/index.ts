// Imports
// ========================================================
import { JSONRPCClient, JSONRPCResponse } from "json-rpc-2.0";
import { fetch } from 'undici';

// Constants
// ========================================================
const RPC_SERVER_URL = `http://localhost:5001/json-rpc`;

// JSONRPCClient needs to know how to send a JSON-RPC request.
// Tell it by passing a function to its constructor. The function must take a JSON-RPC request and send it.
const client = new JSONRPCClient(async (jsonRPCRequest) => {
    console.group('client request\n========================================================');

    // Formatted json-rpc request
    console.log({ jsonRPCRequest });

    // Make request
    try {
        const jsonRPCResponse = await fetch(`${RPC_SERVER_URL}`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(jsonRPCRequest),
        });
        console.log({ jsonRPCResponse });

        // Get json result
        const json = await jsonRPCResponse.json() as JSONRPCResponse | JSONRPCResponse[];
        console.log({ json });

        // If not status 200 or error attribute present
        if (jsonRPCResponse.status !== 200 || 'error' in json) {
            throw new Error(jsonRPCResponse.statusText);
        } 

        console.groupEnd();

        // Make sure the client receives the response
        client.receive(json);
    } catch (error) {
        console.log({ error });
        console.groupEnd();

        // Make sure the client receives the response
        client.receive(error as JSONRPCResponse | JSONRPCResponse[]);
    }
});

// Requests
// ========================================================
(async () => {
    // Request
    try {
        const resultEcho = await client.request('echo', { text: "Hello, World!" });
        console.log({ resultEcho });
    } catch (error) {
        console.log({ error });
    }

    // --- Visual Spacer
    console.log(' ');
    console.log(' ');

    // Notify
    try {
        const resultLog = await client.notify('log', { message: "Log this!" });
        // will return nothing because notify is set to `void`
        console.log({ resultLog });
    } catch (error) {
        console.log({ error });
    }

    // Send
    try {
        const resultSendAddTwo = await client.send({ jsonrpc: '2.0', method: 'addTwo', params: { number: 1 }, id: 1 });
        // will return nothing because send is set to `Promise<void>`
        console.log({ resultSendAddTwo });
    } catch (error) {
        console.log({ error });
    }

    // --- Visual Spacer
    console.log(' ');
    console.log(' ');

    // Batch requests
    try {
        const resultBatch = await client.requestAdvanced([
            {
                jsonrpc: '2.0',
                id: 1,
                method: 'addTwo',
                params:  {
                    number: 5
                }
            },
            {
                jsonrpc: '2.0',
                id: 2,
                method: 'echo',
                params:  {
                    text: 'Hello again!'
                }
            }
        ]);
        console.log({ resultBatch });
    } catch (error) {
        console.log({ error });
    }


    // End script
    process.exit(0);
})();