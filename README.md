# JSON-RPC Example

This is an example of using a JSON-RPC server and client to make requests from two different services.

---

## Requirements

- Node `v18.12.1` or NVM
- pnpm `7.21.0` or greater

---

## Running Services

How to get up and running and testing these scripts

### 1 - Install Dependencies

```bash
pnpm install;
```

### 2 - Run JSON-RPC Server

In one terminal run:

```bash
pnpm run server;

# Expected Output:
# Listening on port 5001
```

### 2 - Run JSON-RPC Client

In another (new) terminal run:

```bash
pnpm run client;

# Expected Output:
# client request
# ========================================================
#   {
#     jsonRPCRequest: {
#       jsonrpc: '2.0',
#       id: 1,
#       method: 'echo',
#       params: { text: 'Hello, World!' }
#     }
#   }
# ...
```





