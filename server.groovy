final IP = container.env['OPENSHIFT_VERTX_IP'] ?: '127.0.0.1'
final PORT = container.env['OPENSHIFT_VERTX_PORT']?.toInteger() ?: 8080


def logBindResult = { asyncResult ->
  if (asyncResult.succeeded) {
    println "Successfully listening on $IP:$PORT"
  } else {
    println "Could not bind to $IP:$PORT. $asyncResult"
  }
}

int effectivePort(URL url) {
  def ep = url.port
  if (ep == -1)
    ep = url.defaultPort
  return ep
}

boolean isRedirect(int statusCode) {
  boolean result = false
  if (300 <= statusCode && statusCode <= 308)
    result = true
  return result
}

void handleRedirect(java.net.URL contextUrl, contextRes, proxyRes) {
  def statusCode = contextRes.statusCode
  def location = contextRes.headers['Location']
  def url = new URL(contextUrl, location)
  println("Got $statusCode. Redirecting to: $url")
  doProxy(url, proxyRes)
}

boolean isChunked(response) {
  String te = response.headers['Transfer-encoding']
  return te == 'chunked'
}

void handleNormal(res, proxyRes) {
  println("Got ${res.statusCode}. Returning response")
  proxyRes.statusCode = res.statusCode
  proxyRes.headers.set(res.headers)

  // Rewriting headers does not set Content-Length, since length can only be known after reading data below.
  // As a workaround, always send proxied response in chunked encoding.
//  TODO(vucalur): Find a better way if migrating to Vertx 3
  proxyRes.chunked = true

  res.dataHandler { buffer ->
    proxyRes << buffer
  }
  res.endHandler {
    proxyRes.end()
  }
  println("Response proxied")
}

void doProxy(java.net.URL url, proxyRes) {
  println("Proxying request: ${url}")

  def port = effectivePort(url)
  def client = vertx.createHttpClient(port: port, host: url.host)
  client.getNow(url.getFile()) { res ->
    int statusCode = res.statusCode
    if (isRedirect(statusCode)) {
      handleRedirect(url, res, proxyRes)
    } else {
      handleNormal(res, proxyRes)
    }
  }
}

vertx.createHttpServer().requestHandler { proxyReq ->
  if (proxyReq.path == '/nemtuRelay') {
    def urlString = proxyReq.headers['nemtuUrl']
    def url = new URL(urlString)
    doProxy(url, proxyReq.response)
  } else {
//    TODO(vucalur): Enable Angular's HTML5 mode and send index.html if requested file not found
    def file = proxyReq.path == '/' ? 'index.html' : proxyReq.path
    println("Serving: ${file}")
    proxyReq.response.sendFile "dist/$file"
  }
}.listen(PORT, IP, logBindResult)
