// Dependencies
import { serve } from "https://deno.land/std@0.170.0/http/mod.ts";

// See whenever we get an inbound request
async function reqHandler(req: Request) {
    // Replace host, checking the subdomain
    const url = new URL(req.url)
    url.host = "phish.report"

    // Figure out stuff for cors
    const CORSheaders = new Headers()
    const origin = "https://discord.com"

    const AllowedHeaders = "authorization,content-type"

    // Set cors
    CORSheaders.set("access-control-allow-origin", origin)
    CORSheaders.set("access-control-allow-headers", AllowedHeaders)
    CORSheaders.set("access-control-allow-credentials", "true")
    if (req.method.toUpperCase() == "OPTIONS") {
        console.info(`Sent OPTIONS: ${url}`)
        return new Response(null, {
            headers: CORSheaders
        })
    }

    // Perform the request
    const response = await fetch(url, {
        method: req.method,
        headers: req.headers,
        body: req.body
    })
    console.info(`Performed request: ${url}`)

    // Add CORS to headers
    const responseHeaders = new Headers(response.headers)
    responseHeaders.set("access-control-allow-origin", origin)
    responseHeaders.set("access-control-allow-headers", AllowedHeaders)
    responseHeaders.set("access-control-allow-credentials", "true")

    // Return
    return new Response(response.body, {
        headers: responseHeaders,
        status: response.status,
        statusText: response.statusText
    })
}

// Serve
serve(reqHandler, {port: 443});