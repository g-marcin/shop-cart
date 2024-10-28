import http from 'http'
let productsResponse
import('./full-response.json').then((module) => {
    productsResponse = module.default
})

const server = http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*', // Allow requests from any origin
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS', // Allow specific HTTP methods
        'Access-Control-Allow-Headers': 'Content-Type, Authorization', // Allow specific headers
    })
    res.end(JSON.stringify(productsResponse)) // Ensure the response is a string
})

server.listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})
